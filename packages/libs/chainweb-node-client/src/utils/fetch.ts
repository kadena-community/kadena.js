export const fetch: typeof globalThis.fetch = ((
  ...args: Parameters<typeof globalThis.fetch>
) => {
  if (typeof window !== 'undefined') {
    return window.fetch(...args);
  }
  if (typeof globalThis.fetch !== 'undefined') {
    return globalThis.fetch(...args);
  }
  return import('node-fetch-native').then(({ fetch }) => {
    return fetch(...args);
  });
}) as unknown as typeof globalThis.fetch;
