import { AndroidRemote } from 'react-native-androidtv-remote';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_HOST, PAIRING_PORT, REMOTE_PORT, SERVICE_NAME } from '../constants/config';

const HOST_STORAGE_KEY = 'com.simonchabrier.freeboxremote.host';
const PLAYERS_STORAGE_KEY = 'com.simonchabrier.freeboxremote.players';

export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'pairing_required'
  | 'connected'
  | 'reconnecting'
  | 'error';

export type SavedPlayer = { name: string; host: string };

type Listener = (state: ConnectionState) => void;
type PoweredListener = (poweredOn: boolean) => void;

// Chaque Player a son propre certificat d'appairage : la clé du Keychain est
// donc dérivée de l'IP pour ne jamais mélanger les certificats de deux
// appareils différents.
function certServiceForHost(host: string): string {
  return `com.simonchabrier.freeboxremote.cert.${host}`;
}

class AuthServiceImpl {
  private remote: AndroidRemote | null = null;
  private host: string = DEFAULT_HOST;
  private state: ConnectionState = 'disconnected';
  private listeners = new Set<Listener>();
  private poweredOn = false;
  private poweredListeners = new Set<PoweredListener>();

  getState(): ConnectionState {
    return this.state;
  }

  getPoweredOn(): boolean {
    return this.poweredOn;
  }

  subscribePowered(listener: PoweredListener): () => void {
    this.poweredListeners.add(listener);
    listener(this.poweredOn);
    return () => this.poweredListeners.delete(listener);
  }

  private setPoweredOn(next: boolean) {
    this.poweredOn = next;
    this.poweredListeners.forEach(listener => listener(next));
  }

  getHost(): string {
    return this.host;
  }

  getRemote(): AndroidRemote | null {
    return this.remote;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private setState(next: ConnectionState) {
    this.state = next;
    this.listeners.forEach(listener => listener(next));
  }

  async loadPersistedHost(): Promise<string> {
    const stored = await AsyncStorage.getItem(HOST_STORAGE_KEY);
    this.host = stored ?? DEFAULT_HOST;
    return this.host;
  }

  async setHost(host: string): Promise<void> {
    this.host = host;
    await AsyncStorage.setItem(HOST_STORAGE_KEY, host);
  }

  async getSavedPlayers(): Promise<SavedPlayer[]> {
    const raw = await AsyncStorage.getItem(PLAYERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  async savePlayer(name: string, host: string): Promise<SavedPlayer[]> {
    const players = await this.getSavedPlayers();
    const updated = [...players.filter(p => p.host !== host), { name, host }];
    await AsyncStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  async removePlayer(host: string): Promise<SavedPlayer[]> {
    const players = await this.getSavedPlayers();
    const updated = players.filter(p => p.host !== host);
    await AsyncStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  // Se connecte à la TV. Réutilise le certificat stocké s'il existe (reconnexion
  // silencieuse) ; sinon un pairing est déclenché et l'événement 'secret' fait
  // passer l'état à 'pairing_required' pour que l'UI demande le code PIN.
  async connect(): Promise<void> {
    this.remote?.stop();
    this.setState('connecting');

    let cert: { key: string; cert: string } | undefined;
    const stored = await Keychain.getGenericPassword({ service: certServiceForHost(this.host) });
    if (stored) {
      cert = JSON.parse(stored.password);
    }

    const remote = new AndroidRemote(this.host, {
      pairing_port: PAIRING_PORT,
      remote_port: REMOTE_PORT,
      service_name: SERVICE_NAME,
      systeminfo: { manufacturer: 'Freebox', model: 'Player Mini 4K Remote' },
      cert,
    });
    this.remote = remote;

    remote.on('secret', () => this.setState('pairing_required'));
    remote.on('ready', () => this.setState('connected'));
    remote.on('unpaired', () => {
      this.setState('disconnected');
      this.setPoweredOn(false);
    });
    // État réel d'allumage/veille du Player (indépendant de l'état de la
    // connexion réseau, qui elle reste active même en veille).
    remote.on('powered', poweredOn => this.setPoweredOn(poweredOn));
    // EventEmitter jette une exception non interceptée si 'error' est émis
    // sans listener : on doit toujours en avoir un, même minimal.
    remote.on('error', error => {
      console.warn('AndroidRemote error', error);
    });

    try {
      await remote.start();
      const newCert = remote.getCertificate();
      if (newCert?.key && newCert?.cert) {
        await Keychain.setGenericPassword('freebox-cert', JSON.stringify(newCert), {
          service: certServiceForHost(this.host),
        });
      }
    } catch {
      this.setState('error');
    }
  }

  // Renvoie true si le code était correct (le pairing se termine alors en tâche
  // de fond et l'état passera à 'connected' via l'événement 'ready').
  async submitPairingCode(code: string): Promise<boolean> {
    if (!this.remote) return false;
    const accepted = await this.remote.sendPairingCode(code);
    if (!accepted) {
      this.setState('error');
    }
    return accepted;
  }

  // Appelé quand une commande échoue parce que la connexion est en fait
  // coupée au moment de l'envoi (ex: "Socket is closed"). La lib gère déjà
  // sa propre reconnexion automatique en interne (RemoteManager relance la
  // connexion tout seul et réémettra 'ready', ce qui repassera l'état à
  // 'connected') : on ne fait qu'afficher un état transitoire, sans créer de
  // deuxième connexion concurrente.
  reportTransportFailure(): void {
    console.warn('Commande non envoyée : connexion momentanément coupée');
    if (this.state === 'connected') {
      this.setState('reconnecting');
    }
  }

  disconnect(): void {
    this.remote?.stop();
    this.remote = null;
    this.setState('disconnected');
    this.setPoweredOn(false);
  }
}

export const AuthService = new AuthServiceImpl();
