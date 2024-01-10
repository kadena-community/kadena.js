import type { IConfigTreeItem } from 'src/types';
import { getUrlNameOfPageFile } from '../getUrlNameOfPageFile';

describe('utils getUrlNameOfPageFile', () => {
  it('should return the correct image url from the string', async () => {
    const page: IConfigTreeItem = {
      url: '/ambassadors',
      file: '/contribute/ambassadors/index.md',
      id: 'ambassadors',
    };
    const parentTree: IConfigTreeItem[] = [
      {
        url: '/contribute',
        file: '/contribute/index.tsx',
        children: [page],
        id: 'contribute',
      },
    ];

    const expectedResult = '/contribute/ambassadors';
    expect(getUrlNameOfPageFile(page, parentTree)).toEqual(expectedResult);
  });
  it('should return the correct image url from the string and large parent', async () => {
    const page: IConfigTreeItem = {
      url: '/ambassadors',
      file: '/contribute/ambassadors/index.md',
      id: 'ambassadors',
    };
    const parentTree: IConfigTreeItem[] = [
      {
        url: '/contribute',
        file: '/contribute/index.tsx',
        children: [page],
        id: 'contribute',
      },
      {
        url: '/node',
        file: '/node/index.tsx',
        id: 'node',
      },
      {
        url: '/test',
        file: '/nodetttt/index.tsx',
        id: 'nodetest',
      },
    ];

    const expectedResult = '/contribute/node/test/ambassadors';
    expect(getUrlNameOfPageFile(page, parentTree)).toEqual(expectedResult);
  });

  it('should return undefined when there is no page', async () => {
    const page = undefined as unknown as IConfigTreeItem;
    const parentTree: IConfigTreeItem[] = [
      {
        url: '/contribute',
        file: '/contribute/index.tsx',
        children: [page],
        id: 'contribute',
      },
    ];

    expect(getUrlNameOfPageFile(page, parentTree)).toEqual('');
  });
});
