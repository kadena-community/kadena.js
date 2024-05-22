import { renderHook } from '@testing-library/react-hooks';
import type { MockInstance } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useIphoneInputFix } from './../useIphoneInputFix';

Object.defineProperty(
  global.navigator,
  'userAgent',
  ((value) => ({
    get() {
      return value;
    },

    set(v) {
      value = v;
    },
  }))(window.navigator.userAgent),
);

describe('useIphoneInputFix', () => {
  let querySelectorSpy: MockInstance;
  let setAttributeSpy: MockInstance;
  beforeEach(() => {
    setAttributeSpy = vi.fn();

    querySelectorSpy = vi.spyOn(document, 'querySelector').mockReturnValue({
      // @ts-ignore
      setAttribute: setAttributeSpy,
    });
  });
  it('should update the viewport, if agent is NOT iphone', () => {
    // @ts-ignore
    global.navigator.userAgent = 'Google';

    renderHook(() => useIphoneInputFix());
    expect(querySelectorSpy).toBeCalledTimes(1);
    expect(querySelectorSpy).toBeCalledWith('[name=viewport]');
    expect(setAttributeSpy).toBeCalledWith(
      'content',
      'width=device-width, initial-scale=1',
    );
  });
  it('should update the viewport, if agent is Iphone', () => {
    // @ts-ignore
    global.navigator.userAgent = 'iPhone';

    renderHook(() => useIphoneInputFix());
    expect(querySelectorSpy).toBeCalledTimes(0);
    expect(setAttributeSpy).toBeCalledTimes(0);
  });
});
