import { getFileName } from '../getFileName';
import type { IFile } from './../../../types';

describe('getFileName', () => {
  it('should return the correct filename from a given IFile', () => {
    const file: IFile = {
      data: {},
      messages: [],
      history: [
        '/Users/straatemans/Documents/projects/kadena/kadena.js/packages/apps/docs/src/pages/learn/why-build/index.md',
      ],
      value: '---\n',
    };

    const result = getFileName(file);
    expect(result).toBe(
      '/Users/straatemans/Documents/projects/kadena/kadena.js/packages/apps/docs/src/pages/learn/why-build/index.md',
    );
  });
  it('should return the empty string if there is no filename in given IFile', () => {
    const file: IFile = {
      data: {},
      messages: [],
      history: [],
      value: '---\n',
    };

    const result = getFileName(file);
    expect(result).toBe('');
  });
});
