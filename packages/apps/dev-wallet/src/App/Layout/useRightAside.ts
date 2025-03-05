import { useSideBarLayout } from '@kadena/kode-ui/patterns';
import { useCallback, useEffect, useState } from 'react';

export function useRightAside() {
  const [expanded, setExpanded] = useState(false);
  const { isRightAsideExpanded, setIsRightAsideExpanded } = useSideBarLayout();

  useEffect(() => {
    if (!isRightAsideExpanded && expanded) {
      setExpanded(false);
    }
  }, [isRightAsideExpanded, expanded]);

  return [
    expanded,
    useCallback(() => {
      if (isRightAsideExpanded && !expanded) {
        throw new Error('Right aside is already open with a different panel');
      }
      setIsRightAsideExpanded(true);
      setExpanded(true);
    }, [isRightAsideExpanded, expanded, setIsRightAsideExpanded]),
    useCallback(() => {
      if (expanded) {
        setIsRightAsideExpanded(false);
        setExpanded(false);
      }
    }, [expanded, setIsRightAsideExpanded]),
  ] as [isExpanded: boolean, expand: () => void, close: () => void];
}
