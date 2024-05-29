export const fetch: typeof globalThis.fetch = ((
  ...args: Parameters<typeof globalThis.fetch>
) => {
  if (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.fetch !== 'undefined'
  ) {
    return globalThis.fetch(...args);
  }

  if (typeof window !== 'undefined' && typeof window.fetch !== 'undefined') {
    return window.fetch(...args);
  }

  if (typeof global !== 'undefined' && typeof global.fetch !== 'undefined') {
    return global.fetch(...args);
  }

  return import('cross-fetch').then(({ fetch }) => {
    return fetch(...args);
  });
}) as unknown as typeof globalThis.fetch;
