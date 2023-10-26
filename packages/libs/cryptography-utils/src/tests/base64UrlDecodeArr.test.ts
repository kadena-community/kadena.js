import { expect, test } from 'vitest';
import { base64UrlDecodeArr } from '../base64UrlDecodeArr';

test('Takes in a Base 64 URL encoded string and outputs a decoded Uint8Array binary object', () => {
  const str = 'zaqnRQ0RYzxTccjtYoBvQsDo5K9mxr4TEF-HIYTi5Jo';

  const actual = base64UrlDecodeArr(str);
  const expected = new Uint8Array([
    205, 170, 167, 69, 13, 17, 99, 60, 83, 113, 200, 237, 98, 128, 111, 66, 192,
    232, 228, 175, 102, 198, 190, 19, 16, 95, 135, 33, 132, 226, 228, 154,
  ]);

  expect(expected).toEqual(actual);
});
