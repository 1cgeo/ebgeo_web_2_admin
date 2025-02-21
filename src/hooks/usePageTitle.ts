// Path: hooks\usePageTitle.ts
import { useEffect } from 'react';

import { useGlobal } from '@/hooks/useGlobal';

export const usePageTitle = (title: string) => {
  const { dispatch } = useGlobal();

  useEffect(() => {
    dispatch({ type: 'SET_PAGE_TITLE', payload: title });
    document.title = `EBGeo Admin - ${title}`;

    return () => {
      dispatch({ type: 'SET_PAGE_TITLE', payload: '' });
    };
  }, [title, dispatch]);
};
