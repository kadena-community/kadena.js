import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTheme } from '../useTheme';
import { Themes, storageKey } from '../useTheme/utils/constants';

const mocks = vi.hoisted(() => {
  return {
    getSystemTheme: vi.fn(),
  };
});
describe('useTheme', () => {
  beforeEach(() => {
    vi.mock('../useTheme/utils/getSystemTheme', () => ({
      getSystemTheme: mocks.getSystemTheme,
    }));
  });

  afterEach(() => {
    window.localStorage.removeItem(storageKey);
    vi.resetAllMocks();
  });

  it('should set the state of the system (dark) when there is no localstorage set', () => {
    mocks.getSystemTheme.mockReturnValue(Themes.dark);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toEqual(Themes.dark);
  });

  it('should set the state of the system (light) when there is no localstorage set', () => {
    mocks.getSystemTheme.mockReturnValue(Themes.light);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toEqual(Themes.light);
  });

  it('should set the state of the localstorage value (light), if available', () => {
    window.localStorage.setItem(storageKey, Themes.light);

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toEqual(Themes.light);
  });

  it('should set the state of the localstorage value (light), if available', () => {
    window.localStorage.setItem(storageKey, Themes.dark);

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toEqual(Themes.dark);
  });

  it('should lock the theme when it is given as a prop (dark)', () => {
    window.localStorage.setItem(storageKey, Themes.light);

    expect(localStorage.getItem(storageKey)).toEqual(Themes.light);

    const { result } = renderHook(() => useTheme({ lockedTheme: Themes.dark }));
    expect(result.current.theme).toEqual(Themes.dark);
    expect(localStorage.getItem(storageKey)).toEqual(Themes.dark);
  });

  it('should overwrite the theme when given as prop', () => {
    window.localStorage.setItem(storageKey, Themes.light);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toEqual(Themes.light);

    const { result: result2 } = renderHook(() =>
      useTheme({ overwriteTheme: Themes.dark }),
    );

    expect(result2.current.theme).toEqual(Themes.dark);
  });
  it('should overwrite the theme when given as prop and the overwrite is set as well', () => {
    expect(localStorage.getItem(storageKey)).toEqual(null);

    const { result } = renderHook(() =>
      useTheme({ overwriteTheme: Themes.light, lockedTheme: Themes.dark }),
    );

    expect(localStorage.getItem(storageKey)).toEqual(Themes.dark);
    expect(result.current.theme).toEqual(Themes.light);
  });
  it('should switch state when the setTheme is called', () => {
    window.localStorage.setItem(storageKey, Themes.light);
    const { result, rerender } = renderHook(() => useTheme());
    expect(result.current.theme).toEqual(Themes.light);

    result.current.setTheme(Themes.dark);
    rerender();
    expect(result.current.theme).toEqual(Themes.dark);
  });

  it('should switch state when the setTheme is called, but the overwrite should still hold', () => {
    window.localStorage.setItem(storageKey, Themes.light);
    const { result, rerender } = renderHook(() =>
      useTheme({ overwriteTheme: Themes.light }),
    );
    expect(result.current.theme).toEqual(Themes.light);

    result.current.setTheme(Themes.dark);
    rerender();
    expect(result.current.theme).toEqual(Themes.light);
  });
});
