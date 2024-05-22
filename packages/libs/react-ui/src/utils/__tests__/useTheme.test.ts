import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTheme } from '../useTheme';
import { storageKey } from '../useTheme/utils/constants';

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
    mocks.getSystemTheme.mockReturnValue('dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toEqual('dark');
  });

  it('should set the state of the system (light) when there is no localstorage set', () => {
    mocks.getSystemTheme.mockReturnValue('light');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toEqual('light');
  });

  it('should set the state of the localstorage value (light), if available', () => {
    window.localStorage.setItem(storageKey, 'light');

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toEqual('light');
  });

  it('should set the state of the localstorage value (light), if available', () => {
    window.localStorage.setItem(storageKey, 'dark');

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toEqual('dark');
  });

  it('should lock the theme when it is given as a prop (dark)', () => {
    window.localStorage.setItem(storageKey, 'light');

    expect(localStorage.getItem(storageKey)).toEqual('light');

    const { result } = renderHook(() => useTheme({ lockedTheme: 'dark' }));
    expect(result.current.theme).toEqual('dark');
    expect(localStorage.getItem(storageKey)).toEqual('dark');
  });

  it('should overwrite the theme when given as prop', () => {
    window.localStorage.setItem(storageKey, 'light');

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toEqual('light');

    const { result: result2 } = renderHook(() =>
      useTheme({ overwriteTheme: 'dark' }),
    );

    expect(result2.current.theme).toEqual('dark');
  });
  it('should overwrite the theme when given as prop and the overwrite is set as well', () => {
    expect(localStorage.getItem(storageKey)).toEqual(null);

    const { result } = renderHook(() =>
      useTheme({ overwriteTheme: 'light', lockedTheme: 'dark' }),
    );

    expect(localStorage.getItem(storageKey)).toEqual('dark');
    expect(result.current.theme).toEqual('light');
  });
  it('should switch state when the setTheme is called', () => {
    window.localStorage.setItem(storageKey, 'light');
    const { result, rerender } = renderHook(() => useTheme());
    expect(result.current.theme).toEqual('light');

    result.current.setTheme('dark');
    rerender();
    expect(result.current.theme).toEqual('dark');
  });

  it('should switch state when the setTheme is called, but the overwrite should still hold', () => {
    window.localStorage.setItem(storageKey, 'light');
    const { result, rerender } = renderHook(() =>
      useTheme({ overwriteTheme: 'light' }),
    );
    expect(result.current.theme).toEqual('light');

    result.current.setTheme('dark');
    rerender();
    expect(result.current.theme).toEqual('light');
  });
});
