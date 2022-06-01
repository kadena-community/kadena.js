import mkCap from '../mkCap';

test('Takes in Pact Capability arguments and outputs Pact Capability object', () => {
  var actual = mkCap('Gas', 'Grants gas payment capability', 'coin.GAS', []);
  var expected = {
    role: 'Gas',
    description: 'Grants gas payment capability',
    cap: {
      name: 'coin.GAS',
      args: [],
    },
  };
  expect(expected).toEqual(actual);
});
