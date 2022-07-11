jest.mock('node-fetch');

import { parseResponse } from '../../parseResponse';

import { mockFetch } from './mockFetch';

import type { Response as NodeFetchResponse } from 'node-fetch';
import fetch from 'node-fetch';

const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFunctionFetch.mockImplementation(
  mockFetch as jest.MockedFunction<typeof fetch>,
);

test('unhandled endpoint should return error', async () => {
  const expectedErrorMsg = 'Unhandled request URL: /unhandled';
  const response = fetch('/unhandled', {});
  const responseActual: Promise<NodeFetchResponse> = parseResponse(response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /send', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = fetch('/api/v1/send', undefined);
  const responseActual: Promise<NodeFetchResponse> = parseResponse(response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /wrongchain', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = fetch('/wrongChain/api/v1/send', undefined);
  const responseActual: Promise<NodeFetchResponse> = parseResponse(response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /duplicate', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = fetch('/duplicate/api/v1/send', undefined);
  const responseActual: Promise<NodeFetchResponse> = parseResponse(response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /local', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = fetch('/api/v1/local', undefined);
  const responseActual: Promise<NodeFetchResponse> = parseResponse(response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /listen', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = fetch('/api/v1/listen', undefined);
  const responseActual: Promise<NodeFetchResponse> = parseResponse(response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /poll', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = fetch('/api/v1/poll', undefined);
  const responseActual: Promise<NodeFetchResponse> = parseResponse(response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /spv', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = fetch('/spv', undefined);
  const responseActual: Promise<NodeFetchResponse> = parseResponse(response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /tooyoung/spv', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = fetch('/tooyoung/spv', undefined);
  const responseActual: Promise<NodeFetchResponse> = parseResponse(response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});
