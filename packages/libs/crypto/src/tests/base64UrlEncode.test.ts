import { base64UrlEncode } from '../base64UrlEncode';
import { uint8ArrayToStr } from '../uint8ArrayToStr';

test('Takes in a string and outputs a Base 64 URL encoded string', () => {
  const str = uint8ArrayToStr(
    new Uint8Array([
      205, 170, 167, 69, 13, 17, 99, 60, 83, 113, 200, 237, 98, 128, 111, 66,
      192, 232, 228, 175, 102, 198, 190, 19, 16, 95, 135, 33, 132, 226, 228,
      154,
    ]),
  );

  const actual = base64UrlEncode(str);
  const expected = 'zaqnRQ0RYzxTccjtYoBvQsDo5K9mxr4TEF-HIYTi5Jo';

  expect(expected).toEqual(actual);
});
