import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { ControlRow } from '../components/ControlRow';
import { DPad } from '../components/DPad';
import { MediaControls } from '../components/MediaControls';
import { AppShortcuts } from '../components/AppShortcuts';
import { NumericPad } from '../components/NumericPad';
import { SettingsModal } from '../components/SettingsModal';
import { useConnection } from '../hooks/useConnection';
import { AuthService } from '../services/AuthService';
import { FavoritesService } from '../services/FavoritesService';
import { colors } from '../constants/theme';

export function RemoteScreen() {
  const { state, connected } = useConnection();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [host, setHost] = useState(AuthService.getHost());

  useEffect(() => {
    (async () => {
      const persisted = await AuthService.loadPersistedHost();
      setHost(persisted);
      AuthService.connect();
    })();
    FavoritesService.load();
  }, []);

  // Premier appairage : la TV affiche un code PIN dès que l'événement 'secret'
  // arrive, donc on ouvre directement les réglages pour le saisir sans action
  // manuelle de l'utilisateur.
  useEffect(() => {
    if (state === 'pairing_required') {
      setSettingsVisible(true);
    }
  }, [state]);

  const handleCloseSettings = () => {
    setSettingsVisible(false);
    setHost(AuthService.getHost());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Header state={state} disabled={!connected} onPressSettings={() => setSettingsVisible(true)} />
        <NumericPad disabled={!connected} />
        <ControlRow disabled={!connected} />
        <DPad disabled={!connected} />
        <View style={styles.mediaAndAppsRow}>
          <MediaControls disabled={!connected} />
          <AppShortcuts disabled={!connected} />
        </View>
      </View>
      <SettingsModal visible={settingsVisible} onClose={handleCloseSettings} state={state} host={host} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  mediaAndAppsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
});
