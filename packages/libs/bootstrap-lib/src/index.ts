import { fetch, Response } from 'cross-fetch';

/**
 * @internal
 */
export const x = () => (): Promise<Response> =>
  fetch('http://somethod.com', {
    method: 'POST',
    body: JSON.stringify({ test: 'hahaha' }),
  });
