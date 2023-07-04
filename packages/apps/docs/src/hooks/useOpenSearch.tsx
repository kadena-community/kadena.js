import { useModal } from '@kadena/react-ui';

import { SearchModal } from '@/components';
import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import React, { useEffect } from 'react';

interface IReturnProps {
  handleOpenSearch: () => void;
}

export const useOpenSearch = (): IReturnProps => {
  const { renderModal } = useModal();
  const handleOpenSearch = (): void => {
    // TODO: new story will use, probably a context to open a modal for the search
    analyticsEvent(EVENT_NAMES['click:open_searchmodal']);
    renderModal(<SearchModal />, 'Search spaces');
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.key === '/') {
        handleOpenSearch();
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, []);

  return {
    handleOpenSearch,
  };
};
