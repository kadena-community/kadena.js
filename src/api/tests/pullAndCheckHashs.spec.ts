import { pullAndCheckHashs } from '../pullAndCheckHashs';
import { signCmd } from './mockdata/execCmd';

test('Takes in singleCmd object and outputs mkPublicSend formatted specifically for a send request', () => {
  var actual = pullAndCheckHashs([signCmd]);
  var expected = 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8';

  expect(expected).toEqual(actual);
});
