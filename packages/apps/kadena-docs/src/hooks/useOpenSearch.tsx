import { Card, useModal } from '@kadena/react-ui';

import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import React, { FC, useEffect } from 'react';

interface IReturnProps {
  handleOpenSearch: () => void;
}

// @TODO: this is temporary to test if the component works in Docs
const Modal: FC = () => (
  <>
    <Card>sdfsdf</Card>
    <Card>sdfsdf</Card>
  </>
);

export const useOpenSearch = (): IReturnProps => {
  const { renderModal } = useModal();
  const handleOpenSearch = (): void => {
    // TODO: new story will use, probably a context to open a modal for the search
    analyticsEvent(EVENT_NAMES['click:open_searchmodal']);
    renderModal(<Modal />);
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
