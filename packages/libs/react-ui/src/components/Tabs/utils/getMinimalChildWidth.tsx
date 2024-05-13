import type { RefObject } from 'react';

export const getMinimalChildWidth = (ref: RefObject<HTMLElement>) => {
  const children = ref.current?.children;

  if (!children) {
    return 0;
  }

  const widths = Array.from(children).map(
    (child) => (child as HTMLElement)?.offsetWidth || 0,
  );

  return Math.min(...widths.filter((width) => width === 0));
};
