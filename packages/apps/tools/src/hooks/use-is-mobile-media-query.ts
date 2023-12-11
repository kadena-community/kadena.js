import { useMemo, useSyncExternalStore } from 'react';

/**
 * Checks if the media query matches or not.
 * Compatible with Next.js (handles server-side rendering).
 */
export function useIsMatchingMediaQuery(queryInput: string): boolean {
  // Adjust the media query string if necessary
  const query = queryInput.replace(/^@media( ?)/m, '');

  const isServer = typeof window === 'undefined';

  const [getSnapshot, subscribe] = useMemo(() => {
    if (!isServer) {
      const mediaQueryList = window.matchMedia(query);

      return [
        () => mediaQueryList.matches,
        (notify: () => void) => {
          // Using addEventListener for compatibility with modern browsers
          mediaQueryList.addEventListener('change', notify);
          return () => mediaQueryList.removeEventListener('change', notify);
        },
      ];
    } else {
      // Dummy functions for server side
      return [() => false, (notify: () => void) => () => {}];
    }
  }, [query, isServer]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
