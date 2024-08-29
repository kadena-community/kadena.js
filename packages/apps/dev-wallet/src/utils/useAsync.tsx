import { useEffect, useState } from 'react';

export function useAsync<T, A extends any[]>(
  factory: (...args: A) => Promise<T>,
  ...args: A
) {
  const [state, setState] = useState<T>();
  const [error, setError] = useState<Error>();
  const [pending, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    setState(undefined);
    factory(...args)
      .then(setState)
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, args);

  return [state, error, pending] as const;
}
