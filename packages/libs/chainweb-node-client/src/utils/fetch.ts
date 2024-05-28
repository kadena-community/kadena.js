import nodeFetch from 'node-fetch';

export const fetch: typeof globalThis.fetch = ((
  ...args: Parameters<typeof globalThis.fetch>
) => {
  if (typeof window !== 'undefined') {
    return window.fetch(...args);
  }
  if (typeof globalThis.fetch !== 'undefined') {
    return globalThis.fetch(...args);
  }
  return nodeFetch(...(args as unknown as Parameters<typeof nodeFetch>));
}) as unknown as typeof globalThis.fetch;
