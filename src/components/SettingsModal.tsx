import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { AuthService, ConnectionState, SavedPlayer } from '../services/AuthService';
import { FavoriteChannelsList } from './FavoriteChannelsList';
import { colors } from '../constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  state: ConnectionState;
  host: string;
};

function statusLabel(state: ConnectionState, playerName?: string): string {
  switch (state) {
    case 'connected':
      return playerName ? `Connecté — ${playerName}` : 'Connecté';
    case 'connecting':
      return 'Connexion en cours…';
    case 'reconnecting':
      return 'Reconnexion en cours…';
    case 'pairing_required':
      return 'Entrez le code affiché sur la TV';
    case 'error':
      return 'Erreur de connexion, réessayez';
    default:
      return 'Déconnecté';
  }
}

const BLINKING_STATES: ConnectionState[] = ['connecting', 'reconnecting'];

function statusColor(state: ConnectionState): { dot: string; bg: string } {
  if (state === 'connected') return { dot: colors.online, bg: colors.onlineBg };
  if (BLINKING_STATES.includes(state)) return { dot: colors.reconnecting, bg: colors.reconnectingBg };
  return { dot: colors.offline, bg: colors.offlineBg };
}

export function SettingsModal({ visible, onClose, state, host }: Props) {
  const [ipInput, setIpInput] = useState(host);
  const [nameInput, setNameInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [players, setPlayers] = useState<SavedPlayer[]>([]);
  const [addPlayerOpen, setAddPlayerOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const connected = state === 'connected';
  const pairing = state === 'pairing_required';
  const { dot: statusDot, bg: statusBg } = statusColor(state);
  const connectedPlayerName = players.find(p => p.host === host)?.name;

  useEffect(() => {
    if (visible) {
      setIpInput(host);
      setPinInput('');
      AuthService.getSavedPlayers().then(list => {
        setPlayers(list);
        // Pas encore de Player enregistré : on ouvre directement le formulaire.
        setAddPlayerOpen(list.length === 0);
      });
    }
  }, [host, visible]);

  // Un appairage vient de démarrer : on s'assure que le formulaire (et donc
  // le champ code PIN) reste visible pour que l'utilisateur puisse le saisir.
  useEffect(() => {
    if (pairing) {
      setAddPlayerOpen(true);
    }
  }, [pairing]);

  const connectToHost = async (targetHost: string) => {
    await AuthService.setHost(targetHost);
    setIpInput(targetHost);
    setPinInput('');
    AuthService.connect();
  };

  const handleSaveAndConnect = async () => {
    const trimmedHost = ipInput.trim();
    const trimmedName = nameInput.trim() || trimmedHost;
    const updated = await AuthService.savePlayer(trimmedName, trimmedHost);
    setPlayers(updated);
    setNameInput('');
    connectToHost(trimmedHost);
  };

  const handleSelectPlayer = (player: SavedPlayer) => {
    setAddPlayerOpen(false);
    connectToHost(player.host);
  };

  const handleDeletePlayer = async (playerHost: string) => {
    const updated = await AuthService.removePlayer(playerHost);
    setPlayers(updated);
  };

  const handleSubmitPin = async () => {
    const accepted = await AuthService.submitPairingCode(pinInput.trim());
    if (accepted) {
      setPinInput('');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Réglages</Text>
            <View style={styles.titleSpacer} />
            <TouchableOpacity onPress={onClose} accessibilityLabel="Fermer les réglages">
              <MaterialDesignIcons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={[styles.statusContainer, { backgroundColor: statusBg }]}>
            <Text style={[styles.status, { color: statusDot }]}>{statusLabel(state, connectedPlayerName)}</Text>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled">
            {players.length > 0 && (
              <>
                <View style={styles.hintRow}>
                  <MaterialDesignIcons name="information-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.hintText}>Players enregistrés — touchez pour vous y connecter</Text>
                </View>
                {players.map(player => (
                  <View key={player.host} style={styles.playerRow}>
                    <TouchableOpacity style={styles.playerInfo} onPress={() => handleSelectPlayer(player)}>
                      <MaterialDesignIcons
                        name={player.host === host && connected ? 'remote-tv' : 'remote-tv-off'}
                        size={18}
                        color={player.host === host && connected ? colors.online : colors.textMuted}
                        style={styles.playerIcon}
                      />
                      <View>
                        <Text style={styles.playerName}>{player.name}</Text>
                        <Text style={styles.playerHost}>{player.host}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeletePlayer(player.host)}
                      accessibilityLabel={`Supprimer ${player.name}`}
                      style={styles.playerDelete}
                    >
                      <MaterialDesignIcons name="trash-can-outline" size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            <TouchableOpacity style={styles.collapsibleHeader} onPress={() => setAddPlayerOpen(open => !open)}>
              <Text style={styles.collapsibleTitle}>Ajouter un Player</Text>
              <MaterialDesignIcons
                name={addPlayerOpen ? 'chevron-up' : 'chevron-down'}
                size={22}
                color={colors.textMuted}
              />
            </TouchableOpacity>

            {addPlayerOpen && (
              <View style={styles.collapsibleContent}>
                <Text style={styles.label}>Nom (optionnel)</Text>
                <TextInput
                  style={styles.input}
                  value={nameInput}
                  onChangeText={setNameInput}
                  placeholder="Salon"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="words"
                />

                <Text style={styles.label}>Adresse IP du Player 4K</Text>
                <TextInput
                  style={styles.input}
                  value={ipInput}
                  onChangeText={setIpInput}
                  placeholder="192.168.0.50"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numbers-and-punctuation"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.primaryButton} onPress={handleSaveAndConnect}>
                  <Text style={styles.primaryButtonText}>Enregistrer et se connecter</Text>
                </TouchableOpacity>

                {pairing && (
                  <>
                    <Text style={styles.label}>Code affiché sur la TV</Text>
                    <TextInput
                      style={styles.input}
                      value={pinInput}
                      onChangeText={text => setPinInput(text.toUpperCase())}
                      placeholder="A1B2C3"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="default"
                      autoCapitalize="characters"
                      autoCorrect={false}
                      maxLength={8}
                    />
                    <TouchableOpacity style={styles.primaryButton} onPress={handleSubmitPin}>
                      <Text style={styles.primaryButtonText}>Valider le code</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}

            <TouchableOpacity style={styles.collapsibleHeader} onPress={() => setFavoritesOpen(open => !open)}>
              <Text style={styles.collapsibleTitle}>Chaînes favorites</Text>
              <MaterialDesignIcons
                name={favoritesOpen ? 'chevron-up' : 'chevron-down'}
                size={22}
                color={colors.textMuted}
              />
            </TouchableOpacity>

            {favoritesOpen && (
              <View style={styles.collapsibleContent}>
                <View style={styles.hintRow}>
                  <MaterialDesignIcons name="information-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.hintText}>Touchez une chaîne pour l'ajouter ou la retirer des favoris</Text>
                </View>
                <FavoriteChannelsList />
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginRight: 10,
  },
  titleSpacer: {
    flex: 1,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hintText: {
    color: colors.textMuted,
    fontSize: 13,
    marginLeft: 6,
    flexShrink: 1,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 15,
  },
  statusContainer: {
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  playerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerIcon: {
    marginRight: 12,
  },
  playerName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  playerHost: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  playerDelete: {
    padding: 6,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceAlt,
  },
  collapsibleTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  collapsibleContent: {
    paddingBottom: 8,
  },
});
