import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { useEffect } from 'react';

interface IReturnProps {
  handleOpenSearch: () => void;
}

export const useOpenSearch = (): IReturnProps => {
  const handleOpenSearch = (): void => {
    // TODO: new story will use, probably a context to open a modal for the search
    alert('open search modal');
    analyticsEvent(EVENT_NAMES['click:open_searchmodal']);
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
