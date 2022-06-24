import pullAndCheckHashs from '../pullAndCheckHashs';
import { signCmd } from './mockdata/execCommand';

test('Takes in an array of signature objects and check that all signatures signed the same hash, and outputs the hash', () => {
  const actual = pullAndCheckHashs([signCmd]);
  const expected = 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8';

  expect(expected).toEqual(actual);
});
