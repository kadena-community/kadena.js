import { isIndex } from '../utils/isIndex';

describe('isIndex', () => {
  it('should return true if the filename includes index', () => {
    expect(isIndex('/pages/masters/of/the/universe/index.md')).toBe(true);
    expect(isIndex('/pages/he-man/index.md')).toBe(true);
  });
  it('should return true if the filename does not include index', () => {
    expect(isIndex('/pages/skeletor/greyskull.md')).toBe(false);
  });
});
