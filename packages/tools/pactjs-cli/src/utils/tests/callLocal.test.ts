import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { callLocal } from '../callLocal';

const httpHandlers = [
  http.post('https://json-api.chainweb.com/api/v1/local', () =>
    HttpResponse.json({ json: 'some json' }),
  ),
  http.post(
    'https://text-api.chainweb.com/api/v1/local',
    () => new HttpResponse('some text'),
  ),
];

const server = setupServer(...httpHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('callLocal', () => {
  it('returns the correct jsonResponse on success', async () => {
    const result = await callLocal('https://json-api.chainweb.com', 'body');
    expect(result.jsonResponse).toEqual({ json: 'some json' });
  });

  it('returns the correct textResponse on success', async () => {
    const result = await callLocal('https://text-api.chainweb.com', 'body');
    expect(result.textResponse).toBe('some text');
  });
});
