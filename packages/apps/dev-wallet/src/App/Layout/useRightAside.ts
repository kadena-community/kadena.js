import { useLayout } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';

export function useRightAside() {
  const [expanded, setExpanded] = useState(false);
  const { isRightAsideExpanded, setIsRightAsideExpanded } = useLayout();

  useEffect(() => {
    if (!isRightAsideExpanded && expanded) {
      setExpanded(false);
    }
  }, [isRightAsideExpanded, expanded]);

  return [
    expanded,
    () => {
      if (isRightAsideExpanded && !expanded) {
        throw new Error('Right aside is already open with a different panel');
      }
      setIsRightAsideExpanded(true);
      setExpanded(true);
    },
    () => {
      if (expanded) {
        setIsRightAsideExpanded(false);
        setExpanded(false);
      }
    },
  ] as [isExpanded: boolean, expand: () => void, close: () => void];
}
