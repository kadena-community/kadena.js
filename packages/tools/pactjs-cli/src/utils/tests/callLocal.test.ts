import { callLocal } from '../callLocal';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

const restHandlers = [
  rest.post('https://json-api.chainweb.com/api/v1/local', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ json: 'some json' }));
  }),
  rest.post('https://text-api.chainweb.com/api/v1/local', (req, res, ctx) => {
    return res(ctx.status(200), ctx.text('some text'));
  }),
];

const server = setupServer(...restHandlers);

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
