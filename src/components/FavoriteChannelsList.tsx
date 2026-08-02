import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FavoritesService } from '../services/FavoritesService';
import { useFavorites } from '../hooks/useFavorites';
import { colors } from '../constants/theme';

const ROWS = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25],
];

export function FavoriteChannelsList() {
  const favorites = useFavorites();

  return (
    <View style={styles.container}>
      {ROWS.map(row => (
        <View key={row.join('-')} style={styles.row}>
          {row.map(value => {
            const isFavorite = favorites.has(value);
            return (
              <TouchableOpacity
                key={value}
                onPress={() => FavoritesService.toggle(value)}
                style={[styles.button, { opacity: isFavorite ? 1 : 0.5 }]}
                accessibilityLabel={`Chaîne ${value}${isFavorite ? ', favorite' : ''}`}
              >
                <Text style={styles.buttonText}>{value}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  button: {
    width: 44,
    height: 44,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
