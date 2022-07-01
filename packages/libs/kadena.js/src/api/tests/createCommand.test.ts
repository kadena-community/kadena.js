import { createCommand } from '../createCommand';

import { command, payload, signature } from './mockdata/execCommand';

test('Takes in signature objects and stringified Pact object, and outputs a Signed Pact Command', () => {
  const actual = createCommand([signature], JSON.stringify(payload));
  const expected = command;

  expect(expected).toEqual(actual);
});
