import type { RefObject } from 'react';

export const getMinimalChildWidth = (ref: RefObject<HTMLElement>) => {
  const children = ref.current?.children;

  if (!children) {
    return 0;
  }

  let minimalWidth = 0;

  for (let i = 0; i < children.length; i++) {
    const child = children[i] as HTMLElement;

    if (child.offsetWidth > minimalWidth) {
      minimalWidth = child.offsetWidth;
    }
  }

  return minimalWidth;
};
