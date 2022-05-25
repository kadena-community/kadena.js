import hashBin from '../hashBin';
import pactTestCommand from './mockdata/Pact';

test('should perform blake2b256 hashing on a string and output hash as an Uint8Array binary object', () => {
  const str = JSON.stringify(pactTestCommand);

  const actual = hashBin(str);
  const expected = new Uint8Array([
    186, 137, 108, 137, 216, 120, 13, 99, 126, 15, 142, 5, 160, 73, 103, 162,
    194, 252, 123, 159, 156, 24, 33, 167, 255, 73, 118, 53, 203, 121, 154, 175,
  ]);

  expect(expected).toEqual(actual);
});
