import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContextDef';
import type { AuthContextType } from '../contexts/AuthContext';

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
