import { ConnectionState } from '../services/AuthService';
import { colors } from './theme';

export const BLINKING_STATES: ConnectionState[] = ['connecting', 'reconnecting'];

export function connectionIcon(state: ConnectionState): { name: string; color: string } {
  if (state === 'connected') return { name: 'remote-tv', color: colors.online };
  if (BLINKING_STATES.includes(state)) return { name: 'remote-tv', color: colors.reconnecting };
  return { name: 'remote-tv-off', color: colors.offline };
}
