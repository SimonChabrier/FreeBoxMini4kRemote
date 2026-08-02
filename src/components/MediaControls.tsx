import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RemoteButton } from './RemoteButton';
import { RemoteService } from '../services/RemoteService';
import { BUTTON_SIZE } from '../constants/theme';

type Props = { disabled: boolean };

export function MediaControls({ disabled }: Props) {
  return (
    <View style={styles.container}>
      <RemoteButton icon="rewind" onPress={RemoteService.rewind} disabled={disabled} style={styles.button} accessibilityLabel="Retour rapide" />
      <RemoteButton icon="play-pause" onPress={RemoteService.playPause} disabled={disabled} style={styles.button} accessibilityLabel="Lecture / Pause" />
      <RemoteButton icon="fast-forward" onPress={RemoteService.fastForward} disabled={disabled} style={styles.button} accessibilityLabel="Avance rapide" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    marginHorizontal: 6,
  },
});
