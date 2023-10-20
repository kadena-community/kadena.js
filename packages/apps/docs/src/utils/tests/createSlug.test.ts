import { createSlug } from '../createSlug.mjs';

describe('utils createSlug', () => {
  it('should return a slug from given string"', () => {
    expect(createSlug('By the power of grayskull!')).toEqual(
      'by-the-power-of-grayskull',
    );
    expect(createSlug('here comes spëcíāl characters')).toEqual(
      'here-comes-special-characters',
    );
  });

  it('should ignore index if slug is not empty and not having any special characters', () => {
    expect(createSlug('By the power of grayskull', 1)).toEqual(
      'by-the-power-of-grayskull',
    );
    expect(createSlug('here comes spëcíāl characters', 2)).toEqual(
      'here-comes-special-characters',
    );
  });

  it('should return a slug from given string with index', () => {
    expect(createSlug('By the power of grayskull?', 1)).toEqual(
      'by-the-power-of-grayskull-1',
    );
    expect(createSlug('here comes spëcíāl characters!', 2)).toEqual(
      'here-comes-special-characters-2',
    );
  });

  it('should return menu-{index} if slug and page title is empty ', () => {
    expect(createSlug('', 1)).toEqual('operator-1');
  });

  it('should return page title when slug and index is empty ', () => {
    expect(createSlug('?', undefined, 'page Title')).toEqual('page-title-1');
  });

  it('should return empty string if slug is empty and no index is given', () => {
    expect(createSlug('')).toEqual('');
  });
});
