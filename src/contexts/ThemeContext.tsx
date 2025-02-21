// Path: contexts\ThemeContext.tsx
import { createContext } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextData {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextData | undefined>(
  undefined,
);
