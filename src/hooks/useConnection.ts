import { useEffect, useState } from 'react';
import { AuthService, ConnectionState } from '../services/AuthService';

export function useConnection() {
  const [state, setState] = useState<ConnectionState>(AuthService.getState());

  useEffect(() => AuthService.subscribe(setState), []);

  return { state, connected: state === 'connected' };
}
