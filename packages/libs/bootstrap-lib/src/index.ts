import type { Response } from 'cross-fetch';
import { fetch } from 'cross-fetch';

/**
 * @internal
 */
export const x = (): (() => Promise<Response>) => (): Promise<Response> =>
  fetch('http://somethod.com', {
    method: 'POST',
    body: JSON.stringify({ test: 'hahaha' }),
  });
