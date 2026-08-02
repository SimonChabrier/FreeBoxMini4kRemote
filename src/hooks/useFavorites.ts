import { useEffect, useState } from 'react';
import { FavoritesService } from '../services/FavoritesService';

export function useFavorites(): Set<number> {
  const [favorites, setFavorites] = useState<Set<number>>(FavoritesService.getFavorites());

  useEffect(() => FavoritesService.subscribe(setFavorites), []);

  return favorites;
}
