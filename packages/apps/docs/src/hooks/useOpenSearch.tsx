import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useOpenSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenSearch = useCallback((): void => {
    analyticsEvent(EVENT_NAMES['click:open_searchmodal']);
    setIsOpen(true);
  }, []);

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
    isOpen,
    setIsOpen,
  };
};
