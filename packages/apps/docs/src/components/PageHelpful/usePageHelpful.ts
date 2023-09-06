import useModal from './useModal';

import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { useState } from 'react';

interface IPageHelpfulHookResult {
  handlePageHelpful(): void;
  handlePageNotHelpful(): void;
  isPageHelpful: boolean | undefined;
}

export default function usePageHelpful(
  editLink?: string,
): IPageHelpfulHookResult {
  const { renderModalComponent } = useModal(editLink);
  const [isPageHelpful, setIsPageHelpful] = useState<boolean | undefined>();
  function handlePageHelpful(): void {
    setIsPageHelpful(true);
    analyticsEvent(EVENT_NAMES['click:page_helpful'], {
      pagePath: window.location.pathname,
      isPageHelpful: 'true',
    });
  }

  function handlePageNotHelpful(): void {
    setIsPageHelpful(false);
    renderModalComponent();
  }

  return {
    handlePageHelpful,
    handlePageNotHelpful,
    isPageHelpful,
  };
}
