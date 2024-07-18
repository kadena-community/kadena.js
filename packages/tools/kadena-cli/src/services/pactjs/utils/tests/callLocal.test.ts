import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { fetchModule } from '../callLocal.js';

const httpHandlers = [
  http.post('https://json-api.chainweb.com/api/v1/local', () =>
    HttpResponse.json({
      result: { status: 'success', data: { code: 'module-code' } },
    }),
  ),
  http.post(
    'https://text-api.chainweb.com/api/v1/local',
    () => new HttpResponse('Error-in-fetching'),
  ),
  http.post('https://json-error.chainweb.com/api/v1/local', () =>
    HttpResponse.json({
      result: { status: 'failure', error: 'failure-error' },
    }),
  ),
  http.post('https://json-error-obj.chainweb.com/api/v1/local', () =>
    HttpResponse.json({
      result: { status: 'failure', error: { message: 'failure-error' } },
    }),
  ),
  http.post('https://custom-error-obj.chainweb.com/api/v1/local', () =>
    HttpResponse.json({
      result: { status: 'failure', error: { text: 'failure-error' } },
    }),
  ),
  http.post('https://u-error-obj.chainweb.com/api/v1/local', () =>
    HttpResponse.json({
      result: { status: 'failure' },
    }),
  ),
];

const server = setupServer(...httpHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('callLocal', () => {
  it('returns the correct jsonResponse on success', async () => {
    const { code } = await fetchModule('https://json-api.chainweb.com', 'body');
    expect(code).toEqual('module-code');
  });
  it('returns the correct error message from text', async () => {
    const { error } = await fetchModule(
      'https://text-api.chainweb.com',
      'body',
    );
    expect(error).toBe('Error-in-fetching');
  });
  it('returns the correct error message from error', async () => {
    const { error } = await fetchModule(
      'https://json-error.chainweb.com',
      'body',
    );
    expect(error).toBe('failure-error');
  });
  it('returns the correct error message from error object', async () => {
    const { error } = await fetchModule(
      'https://json-error-obj.chainweb.com',
      'body',
    );
    // expect(error).toBe('{"text":"failure-error"}');
    expect(error).toBe('failure-error');
  });
  it('returns the correct error message from error object', async () => {
    const { error } = await fetchModule(
      'https://custom-error-obj.chainweb.com',
      'body',
    );
    expect(error).toBe('{"text":"failure-error"}');
    // expect(error).toBe('failure-error');
  });
  it('returns the correct error message from undefined error', async () => {
    const { error } = await fetchModule(
      'https://u-error-obj.chainweb.com',
      'body',
    );
    expect(error).toBe('unknown error');
  });
});
