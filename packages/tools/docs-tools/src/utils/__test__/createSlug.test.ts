import { createSlug } from '../createSlug';

describe('utils createSlug', () => {
  it('should return a slug from given string"', () => {
    expect(createSlug('By the power of grayskull!')).toEqual(
      'by-the-power-of-grayskull',
    );
    expect(createSlug('here comes spëcíāl characters')).toEqual(
      'here-comes-special-characters',
    );
  });
  it('should return empty slug when string is empty', () => {
    expect(createSlug('')).toEqual('');
  });
});
