import { throws } from 'assert';
import { base64UrlDecode } from '../base64UrlDecode';
import { uint8ArrayToStr } from '../uint8ArrayToStr';

describe('base64Decode', () => {
  it('takes in a Base 64 URL encoded string and outputs a decoded string', () => {
    const str = 'zaqnRQ0RYzxTccjtYoBvQsDo5K9mxr4TEF-HIYTi5Jo';

    const actual = base64UrlDecode(str);
    const expected = uint8ArrayToStr(
      new Uint8Array([
        205, 170, 167, 69, 13, 17, 99, 60, 83, 113, 200, 237, 98, 128, 111, 66,
        192, 232, 228, 175, 102, 198, 190, 19, 16, 95, 135, 33, 132, 226, 228,
        154,
      ]),
    );

    expect(expected).toEqual(actual);
  });

  it('throws InvalidCharacterError when passing', () => {
    const str = 'zaqnRQ0RYzxTccjtYoBvQsDo5K9mxr4TEF-HIYTi5Joaa';
    throws(() => base64UrlDecode(str));
  });
});
