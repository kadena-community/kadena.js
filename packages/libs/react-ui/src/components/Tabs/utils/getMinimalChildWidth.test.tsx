import type { RefObject } from 'react';
import { describe, expect, it } from 'vitest';
import { getMinimalChildWidth } from './getMinimalChildWidth';

export const mockChildElementsRef = {
  current: {
    children: [
      {
        offsetWidth: 59,
      },
      {
        offsetWidth: 50,
      },
      {
        offsetWidth: 55,
      },
      {
        offsetWidth: 60,
      },
    ],
    length: 3,
  },
} as unknown as RefObject<HTMLDivElement>;

describe('getMinimalChildWidth', () => {
  it('should return the lowest value', async () => {
    expect(getMinimalChildWidth(mockChildElementsRef)).toBe(50);
  });

  it('should return 0 if no children are present', async () => {
    expect(
      getMinimalChildWidth({
        current: { length: 0 },
      } as unknown as RefObject<HTMLDivElement>),
    ).toBe(0);
  });
});
