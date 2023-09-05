jest.mock('node-fetch');

import { parseResponse } from '../../parseResponse';

import { mockFetch } from './mockFetch';

import type { Response } from 'cross-fetch';
import fetch from 'cross-fetch';

const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFunctionFetch.mockImplementation(
  mockFetch as jest.MockedFunction<typeof fetch>,
);

test('unhandled endpoint should return error', async () => {
  const expectedErrorMsg = 'Unhandled request URL: /unhandled';
  const response = await fetch('/unhandled', {});
  const responseActual: Promise<Response> = parseResponse(response as Response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /send', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = await fetch('/api/v1/send', undefined);
  const responseActual: Promise<Response> = parseResponse(response as Response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /wrongchain', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = await fetch('/wrongChain/api/v1/send', undefined);
  const responseActual: Promise<Response> = parseResponse(response as Response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /duplicate', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = await fetch('/duplicate/api/v1/send', undefined);
  const responseActual: Promise<Response> = parseResponse(response as Response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /local', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = await fetch('/api/v1/local', undefined);
  const responseActual: Promise<Response> = parseResponse(response as Response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /local?preflight=true&signatureVerification=true', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = await fetch(
    '/api/v1/local?preflight=true&signatureVerification=true',
    undefined,
  );
  const responseActual: Promise<Response> = parseResponse(response as Response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /local?preflight=true&signatureVerification=false', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = await fetch(
    '/api/v1/local?preflight=true&signatureVerification=false',
    undefined,
  );
  const responseActual: Promise<Response> = parseResponse(response as Response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /listen', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = await fetch('/api/v1/listen', undefined);
  const responseActual: Promise<Response> = parseResponse(response as Response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /poll', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = await fetch('/api/v1/poll', undefined);
  const responseActual: Promise<Response> = parseResponse(response as Response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /spv', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = await fetch('/spv', undefined);
  const responseActual: Promise<Response> = parseResponse(response as Response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('empty requestBody returns error in /tooyoung/spv', async () => {
  const expectedErrorMsg = 'Expected RequestInit body not found.';

  const response = await fetch('/tooyoung/spv', undefined);
  const responseActual: Promise<Response> = parseResponse(response as Response);

  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});
