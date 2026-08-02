# Télécommande Freebox Mini 4K

Application React Native qui transforme un téléphone en télécommande complète
pour une ou plusieurs Freebox Player Mini 4K (Android TV / Google TV), via le
protocole natif Android TV Remote v2 — le même protocole que l'application
officielle Android TV Remote de Google, sans passer par l'ancienne API HTTP
Freebox.

## Stack technique

- **React Native CLI** (pas Expo) — nécessaire pour utiliser des sockets TCP
  natifs (TLS mutuel) avec des modules natifs patchés, incompatibles avec le
  workflow managé Expo.
- **TypeScript**
- **[react-native-androidtv-remote](https://github.com/vricosti/react-native-androidtv-remote)**
  — implémentation du protocole Android TV Remote v2 (pairing, envoi de
  touches, lancement d'apps).
- **react-native-tcp-socket** (patché via `patch-package`) — sockets TCP/TLS
  pour la connexion au Player.
- **react-native-modpow** (patché) — calcul cryptographique pour la
  génération de certificat.
- **react-native-keychain** — stockage sécurisé des certificats d'appairage
  (Keychain iOS / Keystore Android).
- **@react-native-async-storage/async-storage** — persistance légère
  (IP des Players, chaînes favorites).
- **@react-native-vector-icons/material-design-icons** — icônes vectorielles.

## Points forts

- **Écran unique, sans navigation.** Tout est accessible d'un seul coup d'œil,
  sans onglets ni changement d'écran, dans l'esprit d'une vraie télécommande.
- **Multi-Players.** Plusieurs Freebox peuvent être enregistrées (nom + IP)
  et sélectionnées en un tap depuis les Réglages. Chaque Player conserve son
  propre certificat d'appairage (clé Keychain dérivée de l'IP) : changer de
  Player ne casse jamais le pairing d'un autre.
- **Reconnexion silencieuse.** Une fois appairée, l'app se reconnecte
  automatiquement au lancement suivant, sans jamais redemander le code PIN.
- **Indicateur de connexion en temps réel.** Rond vert (connecté), orange
  clignotant (connexion/reconnexion en cours), rouge (déconnecté ou erreur).
- **Chaînes favorites.** N'importe quelle chaîne du pavé 1-25 peut être
  marquée favorite ; les favoris ressortent visuellement (opacité pleine)
  pendant que le reste s'estompe.
- **Robustesse réseau.** Toutes les commandes envoyées sont protégées contre
  les coupures transitoires de socket — une commande qui échoue ne fait
  jamais planter l'app, et la reconnexion se fait sans intervention.
- **Raccourcis d'applications** (YouTube, Prime Video) via lancement direct,
  sans passer par le Play Store.
