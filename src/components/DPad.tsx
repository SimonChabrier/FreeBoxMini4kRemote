import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RemoteButton } from './RemoteButton';
import { RemoteService } from '../services/RemoteService';
import { colors, BUTTON_SIZE } from '../constants/theme';

type Props = { disabled: boolean };

export function DPad({ disabled }: Props) {
  return (
    <View style={styles.container}>
      <RemoteButton icon="arrow-up-bold" onPress={RemoteService.dpadUp} disabled={disabled} style={styles.arrow} accessibilityLabel="Haut" />
      <View style={styles.middleRow}>
        <RemoteButton icon="arrow-left-bold" onPress={RemoteService.dpadLeft} disabled={disabled} style={styles.arrow} accessibilityLabel="Gauche" />
        <RemoteButton label="OK" onPress={RemoteService.ok} disabled={disabled} style={styles.ok} />
        <RemoteButton icon="arrow-right-bold" onPress={RemoteService.dpadRight} disabled={disabled} style={styles.arrow} accessibilityLabel="Droite" />
      </View>
      <RemoteButton icon="arrow-down-bold" onPress={RemoteService.dpadDown} disabled={disabled} style={styles.arrow} accessibilityLabel="Bas" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 24,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    margin: 6,
  },
  ok: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: colors.accent,
    margin: 6,
  },
});
