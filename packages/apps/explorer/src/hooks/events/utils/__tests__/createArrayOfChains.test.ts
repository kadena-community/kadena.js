import { createArrayOfChains } from '../createArrayOfChains';

describe('createArrayOfChains', () => {
  it('should return an empty array, if the value is empty', () => {
    expect(createArrayOfChains()).toEqual([]);
    expect(createArrayOfChains('')).toEqual([]);
  });
  it('should return array, if there is just 1 value', () => {
    expect(createArrayOfChains('1')).toEqual([1]);
    expect(createArrayOfChains('4,')).toEqual([4]);
  });
  it('should return array, if there are more values', () => {
    expect(createArrayOfChains('4,5,6,7')).toEqual([4, 5, 6, 7]);
    expect(createArrayOfChains('1,6,3,4,2')).toEqual([1, 2, 3, 4, 6]);
    expect(createArrayOfChains('1,6 ,3,4, 2, ')).toEqual([1, 2, 3, 4, 6]);
  });
  it('should return array without 99 (to large)', () => {
    expect(createArrayOfChains('4,5,6,7, 99')).toEqual([4, 5, 6, 7]);
  });

  it('should return array when a range is given', () => {
    expect(createArrayOfChains('4,5,6-8,7, 99')).toEqual([4, 5, 6, 7, 8]);
    expect(createArrayOfChains('4,5-12,6-8,7, 99')).toEqual([
      4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
  });
});
