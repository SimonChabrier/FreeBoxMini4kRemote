import { useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

export function usePoweredOn(): boolean {
  const [poweredOn, setPoweredOn] = useState(AuthService.getPoweredOn());

  useEffect(() => AuthService.subscribePowered(setPoweredOn), []);

  return poweredOn;
}
