import { createSlug, createSlugHash } from '../createSlug';

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

describe('utils createSlugHash', () => {
  it('should return empty string when given string is empty', () => {
    expect(createSlugHash('')).toEqual('');
  });
});
