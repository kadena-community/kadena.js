import type { Cache } from 'swr';

export function localStorageProvider() {
  if (typeof window === 'undefined') return new Map([]) as Cache<any>;
  // When initializing, we restore the data from `localStorage` into a map.
  const str = JSON.parse(window?.localStorage.getItem('app-cache') ?? '[]');
  const map = new Map(str) as Cache<any>;

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    const array = Array.from((map as Map<unknown, unknown>).entries());
    const appCache = JSON.stringify(array);
    window?.localStorage.setItem('app-cache', appCache);
  });

  // We still use the map for write & read for performance.
  return map;
}
