import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RemoteButton } from './RemoteButton';
import { RemoteService } from '../services/RemoteService';
import { useFavorites } from '../hooks/useFavorites';

type Props = { disabled: boolean };

const ROWS = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25],
];

export function NumericPad({ disabled }: Props) {
  const favorites = useFavorites();
  const hasFavorites = favorites.size > 0;

  return (
    <View style={styles.container}>
      {ROWS.map(row => (
        <View key={row.join('-')} style={styles.row}>
          {row.map(value => (
            <RemoteButton
              key={value}
              label={String(value)}
              onPress={() => RemoteService.number(value)}
              disabled={disabled}
              style={[styles.button, { opacity: !hasFavorites || favorites.has(value) ? 1 : 0.3 }]}
              textStyle={styles.buttonText}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  button: {
    width: 54,
    height: 54,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 15,
  },
});
