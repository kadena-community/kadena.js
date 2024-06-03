import { getFileNameInPackage } from '../getFileNameInPackage';
import type { IFile } from './../../../types';

describe('getFileNameInPackage', () => {
  it('should return the correct filename in package from the IFile', () => {
    const file: IFile = {
      data: {},
      messages: [],
      history: [
        '/Users/straatemans/Documents/projects/kadena/kadena.js/packages/apps/docs/src/pages/learn/why-build/index.md',
      ],
      value: '---\n',
    };
    const result = getFileNameInPackage(file);
    expect(result).toBe(
      '/packages/apps/docs/src/pages/learn/why-build/index.md',
    );
  });

  it('should return the empty string if IFile has no filename', () => {
    const file: IFile = {
      data: {},
      messages: [],
      history: [],
      value: '---\n',
    };
    const result = getFileNameInPackage(file);
    expect(result).toBe('');
  });
});
