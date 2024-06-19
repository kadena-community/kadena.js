import { createSlug, removHashFromLink } from '../createSlug';

describe('utils createSlug', () => {
  it('should return a slug from given string"', () => {
    expect(createSlug('By the power of grayskull!')).toEqual(
      'by-the-power-of-grayskullh685481917',
    );
    expect(createSlug('here comes spëcíāl characters')).toEqual(
      'here-comes-special-charactersh1315804552',
    );
  });
  it('should return empty slug when string is empty', () => {
    expect(createSlug('')).toEqual('');
  });
});

describe('utils removHashFromLink', () => {
  it('should remove the hash from the link string', () => {
    const url = '/he-man#masters-of-th-univers';
    const expectedResult = '/he-man';

    const result = removHashFromLink(url);
    expect(result).toBe(expectedResult);
  });
  it('should return the link when there is no hash', () => {
    const url = '/skeletor';
    const expectedResult = '/skeletor';

    const result = removHashFromLink(url);
    expect(result).toBe(expectedResult);
  });
});
