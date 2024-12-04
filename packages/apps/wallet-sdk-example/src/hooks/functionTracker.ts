import { useCallback, useState } from 'react';

export interface TrackedFunction {
  name: string;
  args: unknown[] | null;
  response: { data: unknown } | null;
}

export function useFunctionTracker(name: string) {
  const [args, setArgs] = useState<unknown>(null);
  const [response, setResponse] = useState<unknown>(null);
  const clear = useCallback(() => {
    setArgs(null);
    setResponse(null);
  }, []);
  const wrap = useCallback(
    <T extends (...args: any[]) => ReturnType<T>>(fn: T) => {
      return (...args: Parameters<T>): ReturnType<T> => {
        setArgs(args);
        const response = fn(...args);
        Promise.resolve(response).then((data) => setResponse({ data }));
        console.log('track wrap', name, args, response);
        return response;
      };
    },
    [],
  );
  const setAnyArgs = useCallback((args: unknown) => {
    setArgs(Array.isArray(args) ? args : [args]);
  }, []);
  return {
    data: {
      name,
      args,
      response,
    } as TrackedFunction,
    setArgs: setAnyArgs,
    setResponse,
    wrap,
    clear,
  };
}
