import { expect, test } from 'vitest';
import { uint8ArrayToStr } from '../uint8ArrayToStr';

test('should convert Uint8 array to a string', () => {
  const arr = new Uint8Array([
    205, 170, 167, 69, 13, 17, 99, 60, 83, 113, 200, 237, 98, 128, 111, 66, 192,
    232, 228, 175, 102, 198, 190, 19, 16, 95, 135, 33, 132, 226, 228, 154,
  ]);

  const actual = uint8ArrayToStr(arr);
  const expected = uint8ArrayToStr(
    new Uint8Array([
      205, 170, 167, 69, 13, 17, 99, 60, 83, 113, 200, 237, 98, 128, 111, 66,
      192, 232, 228, 175, 102, 198, 190, 19, 16, 95, 135, 33, 132, 226, 228,
      154,
    ]),
  );

  expect(expected).toEqual(actual);
});
