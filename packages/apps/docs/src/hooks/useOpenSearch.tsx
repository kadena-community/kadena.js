import { SearchModal } from '@/components/SearchModal/SearchModal';
import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { useModal } from '@kadena/react-ui';
import React, { useCallback, useEffect } from 'react';

interface IReturnProps {
  handleOpenSearch: () => void;
}

export const useOpenSearch = (): IReturnProps => {
  const { renderModal } = useModal();
  const handleOpenSearch = useCallback((): void => {
    analyticsEvent(EVENT_NAMES['click:open_searchmodal']);
    renderModal(<SearchModal />, 'Search spaces');
  }, [renderModal]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.key === '/') {
        handleOpenSearch();
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [handleOpenSearch]);

  return {
    handleOpenSearch,
  };
};
