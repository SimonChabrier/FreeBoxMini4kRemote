import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { ConnectionState } from '../services/AuthService';
import { RemoteService } from '../services/RemoteService';
import { usePoweredOn } from '../hooks/usePoweredOn';
import { colors } from '../constants/theme';
import { connectionIcon, BLINKING_STATES } from '../constants/connectionIcon';

type Props = {
  state: ConnectionState;
  disabled: boolean;
  onPressSettings: () => void;
};

export function Header({ state, disabled, onPressSettings }: Props) {
  const { name: connectionIconName, color: connectionColor } = connectionIcon(state);
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
      <TouchableOpacity
        onPress={RemoteService.power}
        disabled={disabled}
        style={[styles.iconButton, disabled && styles.disabled]}
        accessibilityLabel={poweredOn ? 'Power (allumé)' : 'Power (éteint)'}
      >
        <MaterialDesignIcons name="power" size={24} color={poweredOn ? colors.online : colors.offline} />
      </TouchableOpacity>
      <View style={styles.rightGroup}>
        <Animated.View style={{ opacity: blink }}>
          <MaterialDesignIcons name={connectionIconName as never} size={22} color={connectionColor} />
        </Animated.View>
        <TouchableOpacity onPress={onPressSettings} style={styles.iconButton} accessibilityLabel="Réglages">
          <MaterialDesignIcons name="cog" size={24} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
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
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.4,
  },
});
