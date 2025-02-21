// Path: providers\GlobalProvider.tsx
import React, { useReducer } from 'react';

import { GlobalContext } from '@/contexts/GlobalContext';
import type { GlobalAction, GlobalState } from '@/contexts/GlobalContext';

const initialState: GlobalState = {
  pageTitle: '',
  showSidebar: true,
  loading: {
    global: false,
  },
  breadcrumbs: [],
};

function globalReducer(state: GlobalState, action: GlobalAction): GlobalState {
  switch (action.type) {
    case 'SET_PAGE_TITLE':
      return {
        ...state,
        pageTitle: action.payload,
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        showSidebar: !state.showSidebar,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'SET_BREADCRUMBS':
      return {
        ...state,
        breadcrumbs: action.payload,
      };
    default:
      return state;
  }
}

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
