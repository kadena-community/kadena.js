import { createSlug } from '..';

describe('utils createSlug', () => {
  test('should return a slug from given string"', () => {
    expect(createSlug('By the power of grayskull!')).toEqual(
      'by-the-power-of-grayskull',
    );
    expect(createSlug('here comes spëcíāl characters')).toEqual(
      'here-comes-special-characters',
    );
  });
});
