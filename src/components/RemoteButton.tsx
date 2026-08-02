import React from 'react';
import { Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { colors } from '../constants/theme';

type Props = {
  label?: string;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  onPress?: () => void;
  // Pour les boutons qui doivent pouvoir être maintenus (ex: avance/retour
  // rapide) : la TV gère elle-même la répétition/accélération tant que
  // START_LONG n'est pas suivi de END_LONG, au lieu de simuler des impulsions
  // répétées depuis l'app.
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
};

export function RemoteButton({
  label,
  icon,
  iconSize = 26,
  iconColor,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  style,
  textStyle,
  accessibilityLabel,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? label}
      style={[styles.base, style, disabled && styles.disabled]}
    >
      {icon ? (
        <MaterialDesignIcons name={icon as never} size={iconSize} color={iconColor ?? colors.text} />
      ) : (
        <Text style={[styles.label, textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
});
