// Path: hooks\useGlobal.ts
import { useContext } from 'react';

import { GlobalContext } from '@/contexts/GlobalContext';

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
}
