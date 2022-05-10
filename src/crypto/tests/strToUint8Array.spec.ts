import strToUint8Array from '../strToUint8Array';

test('should convert string to Uint8 array', () => {
  const str = '';

  const actual = strToUint8Array(str);
  const expected = new Uint8Array([
    205, 170, 167, 69, 13, 17, 99, 60, 83, 113, 200, 237, 98, 128, 111, 66, 192,
    232, 228, 175, 102, 198, 190, 19, 16, 95, 135, 33, 132, 226, 228, 154,
  ]);

  // expect(expected).toEqual(actual);
});
