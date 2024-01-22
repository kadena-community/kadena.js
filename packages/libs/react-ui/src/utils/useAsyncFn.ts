import type { DependencyList } from 'react';
import { useCallback, useRef, useState } from 'react';

import { useMountedState } from './useMountedState';

export type AsyncFn = (...args: any[]) => Promise<any>;
export type AsyncState<T> =
  | {
      isLoading: boolean;
      isSuccess?: boolean;
      isError?: boolean;
      error?: undefined;
      value?: undefined;
    }
  | {
      isLoading: true;
      isSuccess: false;
      isError: false;
      error?: Error | undefined;
      value?: T;
    }
  | {
      isLoading: false;
      isSuccess: false;
      isError: true;
      error: Error;
      value?: undefined;
    }
  | {
      isLoading: false;
      isSuccess: true;
      isError: false;
      error?: undefined;
      value: T;
    };

type AsyncFnState<T extends AsyncFn> = AsyncState<Awaited<ReturnType<T>>>;
export type AsyncFnReturn<T extends AsyncFn = AsyncFn> = [AsyncFnState<T>, T];

/**
 * A hook that manages a state of an async function.
 * useful for avoiding boilerplate when running async functions.
 */
export function useAsyncFn<T extends AsyncFn>(
  fn: T,
  deps: DependencyList = [],
  initialState: AsyncFnState<T> = { isLoading: false },
): AsyncFnReturn<T> {
  const lastCallId = useRef(0);
  const isMounted = useMountedState();
  const [state, set] = useState<AsyncFnState<T>>(initialState);

  const callback = useCallback((...args: Parameters<T>): ReturnType<T> => {
    const callId = ++lastCallId.current;

    if (!state.isLoading) {
      set((prevState) => ({
        ...prevState,
        isLoading: true,
        isSuccess: false,
        isError: false,
      }));
    }

    return fn(...args).then(
      (value) => {
        if (isMounted() && callId === lastCallId.current) {
          set({ value, isLoading: false, isError: false, isSuccess: true });
        }
        return value;
      },
      (error) => {
        if (isMounted() && callId === lastCallId.current) {
          set({ error, isLoading: false, isError: true, isSuccess: false });
        }
        return error;
      },
    ) as ReturnType<T>;
  }, deps);

  return [state, callback as unknown as T];
}
