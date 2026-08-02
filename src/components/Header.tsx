import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { ConnectionState } from '../services/AuthService';
import { RemoteService } from '../services/RemoteService';
import { usePoweredOn } from '../hooks/usePoweredOn';
import { colors } from '../constants/theme';

type Props = {
  state: ConnectionState;
  disabled: boolean;
  onPressSettings: () => void;
};

const BLINKING_STATES: ConnectionState[] = ['connecting', 'reconnecting'];

function badgeColor(state: ConnectionState): { dot: string; bg: string } {
  if (state === 'connected') return { dot: colors.online, bg: colors.onlineBg };
  if (BLINKING_STATES.includes(state)) return { dot: colors.reconnecting, bg: colors.reconnectingBg };
  return { dot: colors.offline, bg: colors.offlineBg };
}

export function Header({ state, disabled, onPressSettings }: Props) {
  const { dot, bg } = badgeColor(state);
  const poweredOn = usePoweredOn();
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (BLINKING_STATES.includes(state)) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(blink, { toValue: 0.25, duration: 450, useNativeDriver: true }),
          Animated.timing(blink, { toValue: 1, duration: 450, useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
    blink.setValue(1);
    return undefined;
  }, [state, blink]);

  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        <View style={[styles.statusBadge, { backgroundColor: bg }]}>
          <Animated.View style={[styles.dot, { backgroundColor: dot, opacity: blink }]} />
        </View>
        <TouchableOpacity
          onPress={RemoteService.power}
          disabled={disabled}
          style={[styles.iconButton, disabled && styles.disabled]}
          accessibilityLabel={poweredOn ? 'Power (allumé)' : 'Power (éteint)'}
        >
          <MaterialDesignIcons name="power" size={24} color={poweredOn ? colors.online : colors.offline} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onPressSettings} style={styles.iconButton} accessibilityLabel="Réglages">
        <MaterialDesignIcons name="cog" size={24} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.4,
  },
});
