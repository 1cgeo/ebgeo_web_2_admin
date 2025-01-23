import React, { createContext, useContext, useReducer, Dispatch } from 'react';

interface GlobalState {
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

type ActionType =
  | { type: 'SET_PAGE_TITLE'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_LOADING'; payload: { key: string; value: boolean } }
  | { type: 'SET_BREADCRUMBS'; payload: Array<{ text: string; href?: string }> };

const initialState: GlobalState = {
  pageTitle: '',
  showSidebar: true,
  loading: {
    global: false
  },
  breadcrumbs: []
};

const GlobalContext = createContext<{
  state: GlobalState;
  dispatch: Dispatch<ActionType>;
}>({
  state: initialState,
  dispatch: () => null
});

function globalReducer(state: GlobalState, action: ActionType): GlobalState {
  switch (action.type) {
    case 'SET_PAGE_TITLE':
      return {
        ...state,
        pageTitle: action.payload
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        showSidebar: !state.showSidebar
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };
    case 'SET_BREADCRUMBS':
      return {
        ...state,
        breadcrumbs: action.payload
      };
    default:
      return state;
  }
}

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};