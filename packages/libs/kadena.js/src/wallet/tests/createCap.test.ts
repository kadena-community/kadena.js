import { createCap } from '../createCap';

test('Takes in Pact Capability arguments and outputs Pact Capability object', () => {
  const actual = createCap(
    'Gas',
    'Grants gas payment capability',
    'coin.GAS',
    [],
  );
  const expected = {
    role: 'Gas',
    description: 'Grants gas payment capability',
    cap: {
      name: 'coin.GAS',
      args: [],
    },
  };
  expect(expected).toEqual(actual);
});
