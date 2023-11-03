import { expect, test } from 'vitest';
import { stringifyAndMakePOSTRequest } from '../stringifyAndMakePOSTRequest';

test('should stringify body and create POST request', () => {
  const body: object = { name: 'hello', val: "'world'" };
  const actual = stringifyAndMakePOSTRequest<object>(body);
  const expected = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: '{"name":"hello","val":"\'world\'"}',
  };

  expect(expected).toEqual(actual);
});
