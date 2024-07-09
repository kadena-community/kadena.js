import { useEffect, useState } from 'react';

export function usePromise<T>(factory: () => Promise<T>) {
  const [state, setState] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    factory()
      .then((data) => {
        setState(data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [factory]);

  return { state, error, loading };
}
