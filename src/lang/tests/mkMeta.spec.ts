import mkMeta from '../mkMeta';

test('Takes in meta data and outputs meta object format', () => {
  var actual = mkMeta('Bob', '4', 0.00001, 10000, 1570133940, 28800);
  var expected = {
    creationTime: 1570133940,
    ttl: 28800,
    gasLimit: 10000,
    chainId: '4',
    gasPrice: 0.00001,
    sender: 'Bob',
  };

  expect(expected).toEqual(actual);
});
