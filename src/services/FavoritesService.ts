import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = 'com.simonchabrier.freeboxremote.favoriteChannels';

type Listener = (favorites: Set<number>) => void;

class FavoritesServiceImpl {
  private favorites: Set<number> = new Set();
  private listeners = new Set<Listener>();

  getFavorites(): Set<number> {
    return this.favorites;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.favorites);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.favorites));
  }

  async load(): Promise<Set<number>> {
    const raw = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    this.favorites = raw ? new Set(JSON.parse(raw)) : new Set();
    this.notify();
    return this.favorites;
  }

  async toggle(channel: number): Promise<void> {
    const next = new Set(this.favorites);
    if (next.has(channel)) {
      next.delete(channel);
    } else {
      next.add(channel);
    }
    this.favorites = next;
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...next]));
    this.notify();
  }
}

export const FavoritesService = new FavoritesServiceImpl();
