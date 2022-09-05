import { fetch, Request, Response } from 'cross-fetch';

export const x = () => (): Promise<Response> =>
  fetch('http://somethod.com', {
    method: 'POST',
    body: JSON.stringify({ test: 'hahaha' }),
  });
