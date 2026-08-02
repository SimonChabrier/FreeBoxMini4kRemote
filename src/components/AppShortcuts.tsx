import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RemoteButton } from './RemoteButton';
import { RemoteService } from '../services/RemoteService';
import { APP_LINKS } from '../constants/config';
import { colors, BUTTON_SIZE } from '../constants/theme';

type Props = { disabled: boolean };

export function AppShortcuts({ disabled }: Props) {
  return (
    <View style={styles.container}>
      <RemoteButton
        icon="youtube"
        iconColor="#FF0000"
        onPress={() => RemoteService.appLink(APP_LINKS.youtube)}
        disabled={disabled}
        style={styles.button}
        accessibilityLabel="YouTube"
      />
      <RemoteButton
        icon="video-box"
        iconColor="#00A8E1"
        onPress={() => RemoteService.appLink(APP_LINKS.primeVideo)}
        disabled={disabled}
        style={styles.button}
        accessibilityLabel="Prime Video"
      />
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
    backgroundColor: colors.surfaceAlt,
  },
});
