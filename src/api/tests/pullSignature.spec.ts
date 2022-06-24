import pullSignature from '../pullSignature';
import { signature } from './mockdata/execCommand';

test('Takes in a signature with hash object and outputs the signature object', () => {
  const actual = pullSignature(signature);
  const expected = {
    sig: '4b0ecfbb0e8f3cb291b57abd27028ceaa221950affa39f10efbf4a5fe740d32670e94c3d3949a7e5f4f6ea692052ca110f7cb2e9a8ee2c5eff4251ed84bbfa03',
  };

  expect(expected).toEqual(actual);
});
