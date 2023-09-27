import usePageHelpfulModal from './usePageHelpfulModal';

import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface IPageHelpfulHookResult {
  handlePageHelpful(): void;
  handlePageNotHelpful(): void;
  isPageHelpful?: string | undefined;
}

export default function usePageHelpful(
  editLink?: string,
): IPageHelpfulHookResult {
  const { renderModalComponent } = usePageHelpfulModal(editLink);
  const pathname = usePathname();
  const localStorageKey = `pageHelpfulVote${pathname}`;
  const [isPageHelpful, setIsPageHelpful] = useState<string | undefined>();

  useEffect(() => {
    const isPageHelpful = localStorage.getItem(localStorageKey) ?? undefined;
    setIsPageHelpful(isPageHelpful);
  }, [localStorageKey]);

  function handlePageHelpful(): void {
    if (isPageHelpful === 'up') {
      setIsPageHelpful('');
      localStorage.setItem(localStorageKey, '');
      return;
    }

    setIsPageHelpful('up');
    localStorage.setItem(localStorageKey, 'up');
    analyticsEvent(EVENT_NAMES['click:page_helpful'], {
      page_path: pathname,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      is_page_helpful: 'yes',
    });
  }

  function handlePageNotHelpful(): void {
    if (isPageHelpful === 'down') {
      setIsPageHelpful('');
      localStorage.setItem(localStorageKey, '');
      return;
    }
    localStorage.setItem(localStorageKey, 'down');
    setIsPageHelpful('down');
    renderModalComponent();
  }

  return {
    handlePageHelpful,
    handlePageNotHelpful,
    isPageHelpful,
  };
}
