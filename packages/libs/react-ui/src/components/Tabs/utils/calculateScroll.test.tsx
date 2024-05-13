import type { RefObject } from 'react';
import { describe, expect, it } from 'vitest';
import { calculateScroll } from './calculateScroll';
import { mockChildElementsRef } from './getMinimalChildWidth.test';

const wrapperContainerRef = {
  current: {
    ...mockChildElementsRef.current,
    scrollWidth: 1000,
    offsetWidth: 100,
  },
} as RefObject<HTMLDivElement>;

const currentValue = (scrollLeft: number) =>
  ({
    current: {
      scrollLeft,
    },
  }) as RefObject<HTMLDivElement>;

describe('calculateScroll', () => {
  it('should return 0 if direction is back and currentValue is less than offset', () => {
    expect(calculateScroll('back', wrapperContainerRef, currentValue(0))).toBe(
      0,
    );
  });

  it('should return 700 if direction is back and currentValue is 750', () => {
    expect(
      calculateScroll('back', wrapperContainerRef, currentValue(750)),
    ).toBe(700);
  });

  it('should return 50 if direction is forward and currentValue is 0', () => {
    expect(
      calculateScroll('forward', wrapperContainerRef, currentValue(0)),
    ).toBe(50);
  });

  it('Should scroll to the end when the next value is more than the max width', () => {
    expect(
      calculateScroll('forward', wrapperContainerRef, currentValue(951)),
    ).toBe(900);
  });

  it("Should return 0 if elements aren't present", () => {
    expect(
      calculateScroll(
        'forward',
        {} as unknown as RefObject<HTMLDivElement>,
        {} as unknown as RefObject<HTMLDivElement>,
      ),
    ).toBe(0);
  });
});
