import { useCallback } from 'react';
import { useGlobal } from '@/context/GlobalContext';

export const useLoading = (key: string = 'global') => {
  const { state, dispatch } = useGlobal();

  const setLoading = useCallback((value: boolean) => {
    dispatch({
      type: 'SET_LOADING',
      payload: { key, value }
    });
  }, [dispatch, key]);

  return {
    isLoading: state.loading[key] || false,
    setLoading
  };
};