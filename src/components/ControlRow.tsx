import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RemoteButton } from './RemoteButton';
import { RemoteService } from '../services/RemoteService';
import { BUTTON_SIZE } from '../constants/theme';

type Props = { disabled: boolean };

// Même gabarit que les boutons du pavé des chaînes (NumericPad), pour que
// cette ligne d'icônes ait l'air d'en être la continuité visuelle.
export function ControlRow({ disabled }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <RemoteButton icon="home" onPress={RemoteService.home} disabled={disabled} style={styles.button} accessibilityLabel="Home" />
        <RemoteButton icon="arrow-u-left-top" onPress={RemoteService.back} disabled={disabled} style={styles.button} accessibilityLabel="Retour" />
        <RemoteButton icon="volume-mute" onPress={RemoteService.mute} disabled={disabled} style={styles.button} accessibilityLabel="Muet" />
        <RemoteButton icon="volume-minus" onPress={RemoteService.volumeDown} disabled={disabled} style={styles.button} accessibilityLabel="Volume -" />
        <RemoteButton icon="volume-plus" onPress={RemoteService.volumeUp} disabled={disabled} style={styles.button} accessibilityLabel="Volume +" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    marginHorizontal: 5,
  },
});
