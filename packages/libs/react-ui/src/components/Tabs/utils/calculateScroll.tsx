import type { RefObject } from 'react';
import { getMinimalChildWidth } from './getMinimalChildWidth';

export const calculateScroll = (
  direction: 'back' | 'forward',
  wrapperContainerRef: RefObject<HTMLDivElement>,
  scrollContainerRef: RefObject<HTMLDivElement>,
) => {
  if (!wrapperContainerRef.current || !scrollContainerRef.current) return 0;
  const maxWidth = wrapperContainerRef.current.scrollWidth;
  const viewWidth = wrapperContainerRef.current.offsetWidth;
  const offset = getMinimalChildWidth(wrapperContainerRef);
  const currentValue = scrollContainerRef.current.scrollLeft;

  if (direction === 'forward') {
    const nextValue = currentValue + offset;

    if (nextValue > maxWidth) {
      return maxWidth - viewWidth;
    }

    return nextValue;
  } else {
    if (Math.abs(currentValue) < offset) {
      return 0;
    }

    return currentValue - offset;
  }
};
