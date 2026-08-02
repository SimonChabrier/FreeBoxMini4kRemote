import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RemoteButton } from './RemoteButton';
import { RemoteService } from '../services/RemoteService';
import { colors } from '../constants/theme';

type Props = { disabled: boolean };

const ROW_BUTTON_SIZE = 46;

export function ControlRow({ disabled }: Props) {
  return (
    <View style={styles.container}>
      <RemoteButton
        icon="power"
        onPress={RemoteService.power}
        disabled={disabled}
        style={[styles.button, styles.power]}
        accessibilityLabel="Power"
      />
      <RemoteButton icon="home" onPress={RemoteService.home} disabled={disabled} style={styles.button} accessibilityLabel="Home" />
      <RemoteButton icon="arrow-u-left-top" onPress={RemoteService.back} disabled={disabled} style={styles.button} accessibilityLabel="Retour" />
      <RemoteButton icon="volume-mute" onPress={RemoteService.mute} disabled={disabled} style={styles.button} accessibilityLabel="Muet" />
      <RemoteButton icon="volume-minus" onPress={RemoteService.volumeDown} disabled={disabled} style={styles.button} accessibilityLabel="Volume -" />
      <RemoteButton icon="volume-plus" onPress={RemoteService.volumeUp} disabled={disabled} style={styles.button} accessibilityLabel="Volume +" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    width: ROW_BUTTON_SIZE,
    height: ROW_BUTTON_SIZE,
    borderRadius: ROW_BUTTON_SIZE / 2,
  },
  power: {
    backgroundColor: colors.power,
  },
});
