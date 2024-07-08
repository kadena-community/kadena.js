import { createSlug } from '../createSlug';

describe('utils createSlug', () => {
  it('should return a slug from given string"', () => {
    expect(createSlug('By the power of grayskull!')).toEqual(
      'by-the-power-of-grayskullh-80578397',
    );
    expect(createSlug('here comes spëcíāl characters')).toEqual(
      'here-comes-special-charactersh103123247',
    );
  });
  it('should return empty slug when string is empty', () => {
    expect(createSlug('')).toEqual('');
  });
});
