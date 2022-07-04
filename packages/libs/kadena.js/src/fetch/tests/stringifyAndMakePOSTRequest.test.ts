import { stringifyAndMakePOSTRequest } from '../stringifyAndMakePOSTRequest';

import type { RequestInit } from 'node-fetch';

test('should stringify body and create POST request', () => {
  const body: object = { name: 'hello', val: "'world'" };
  const actual = stringifyAndMakePOSTRequest<object>(body);
  const expected: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: '{"name":"hello","val":"\'world\'"}',
  };

  expect(expected).toEqual(actual);
});
