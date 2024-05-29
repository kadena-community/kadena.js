import type { RefObject } from 'react';

export const getMinimalChildWidth = (ref: RefObject<HTMLElement>) => {
  const children = ref.current?.children;

  if (!children) {
    return 0;
  }

  const widths = Array.from(children)
    .map((child) => (child as HTMLElement)?.offsetWidth)
    .filter(Boolean);

  if (widths.length === 0) {
    return 0;
  }

  return Math.min(...widths);
};
