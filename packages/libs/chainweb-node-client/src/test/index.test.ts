import { pact } from '../index';

test('Expects functions to be exposed', async () => {
  expect(pact).toBeDefined();
});
