import { findPath } from '../utils/findPath';

describe('findPath', () => {
  it('should return undefined when filename is "index"', () => {
    expect(findPath('./src/pages/learn/index.md')).toEqual(undefined);
  });
  it('should return dir without extension when filename is not "index"', () => {
    expect(findPath('./src/pages/build/pact/language-basics.md')).toEqual(
      '/build/pact/language-basics',
    );
  });

  it('should return dir when there is only a filename', () => {
    expect(findPath('./language-basics.md')).toEqual('/language-basics');
  });
});
