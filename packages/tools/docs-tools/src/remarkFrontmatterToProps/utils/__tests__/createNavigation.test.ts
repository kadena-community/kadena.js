import type { IFile } from 'src/types';
import { createNavigation } from '../createNavigation';
import { getData as getDataMocked } from './../../../mock/getData.mock';

vi.mock('./../../../utils/staticGeneration/getData', () => {
  return {
    getData: async () => {
      return getDataMocked();
    },
  };
});

describe('createNavigation', () => {
  it('should create the next and previous objects for navigation', async () => {
    const file: IFile = {
      data: {},
      messages: [],
      history: [
        '/Users/straatemans/Documents/projects/kadena/kadena.js/packages/apps/docs/src/pages/learn/why-build/index.md',
      ],
      value: '---\n',
    };

    const result = await createNavigation(file);
    expect(result?.next?.root).toEqual('/learn/cryptography');
    expect(result?.previous?.root).toEqual('/learn/what-is-a-blockchain');
  });

  it('should create the only next object for navigation, when the file is the first in the array', async () => {
    const file: IFile = {
      data: {},
      messages: [],
      history: [
        '/Users/straatemans/Documents/projects/kadena/kadena.js/packages/apps/docs/src/pages/learn/index.md',
      ],
      value: '---\n',
    };

    const result = await createNavigation(file);

    expect(result?.previous).toEqual(undefined);
    expect(result?.next?.root).toEqual('/learn/what-is-a-blockchain');
  });

  it('should create the only previous object for navigation, when the file is the last in the array', async () => {
    const file: IFile = {
      data: {},
      messages: [],
      history: [
        '/Users/straatemans/Documents/projects/kadena/kadena.js/packages/apps/docs/src/pages/reference/chainweb-ref/js-bindings/index.md',
      ],
      value: '---\n',
    };

    const result = await createNavigation(file);

    expect(result?.next).toEqual(undefined);
    expect(result?.previous?.root).toEqual(
      '/reference/chainweb-ref/stream-client',
    );
  });
});
