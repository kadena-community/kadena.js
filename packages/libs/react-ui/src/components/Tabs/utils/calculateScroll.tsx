import { RefObject } from 'react';
import { getMinimalChildWidth } from './getMinimalChildWidth';

export const calculateScroll = (
  direction: 'back' | 'forward',
  wrapperContainerRef: RefObject<HTMLDivElement>,
  scrollContainerRef: RefObject<HTMLDivElement>,
) => {
  const maxWidth = wrapperContainerRef.current?.scrollWidth || 0;
  const viewWidth = wrapperContainerRef.current?.offsetWidth || 0;
  const offset = getMinimalChildWidth(scrollContainerRef);
  const currentValue = scrollContainerRef.current?.scrollLeft || 0;

  let nextValue = 0;

  if (direction === 'forward') {
    nextValue = Math.abs(currentValue + offset);

    if (nextValue > maxWidth - viewWidth) {
      nextValue = maxWidth - viewWidth;
    }

    if (nextValue > maxWidth) {
      return currentValue;
    }
  } else {
    nextValue = currentValue - offset;

    if (Math.abs(currentValue) < offset) {
      nextValue = 0;
    }
  }
  return nextValue;
};
