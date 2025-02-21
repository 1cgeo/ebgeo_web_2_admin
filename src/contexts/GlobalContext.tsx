// Path: contexts\GlobalContext.tsx
import { createContext } from 'react';

export interface GlobalState {
  pageTitle: string;
  showSidebar: boolean;
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
  breadcrumbs: Array<{
    text: string;
    href?: string;
  }>;
}

export type GlobalAction =
  | { type: 'SET_PAGE_TITLE'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_LOADING'; payload: { key: string; value: boolean } }
  | {
      type: 'SET_BREADCRUMBS';
      payload: Array<{ text: string; href?: string }>;
    };

export interface GlobalContextData {
  state: GlobalState;
  dispatch: React.Dispatch<GlobalAction>;
}

export const GlobalContext = createContext<GlobalContextData>({
  state: {
    pageTitle: '',
    showSidebar: true,
    loading: {
      global: false,
    },
    breadcrumbs: [],
  },
  dispatch: () => null,
});
