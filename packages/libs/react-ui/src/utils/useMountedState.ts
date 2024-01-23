import { useCallback, useEffect, useRef } from 'react';

/**
 * A hook that returns whether the component is mounted.
 * It is useful for avoiding state updates after unmounting.
 */
export function useMountedState(): () => boolean {
  const mountedRef = useRef<boolean>(false);
  const get = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return get;
}
