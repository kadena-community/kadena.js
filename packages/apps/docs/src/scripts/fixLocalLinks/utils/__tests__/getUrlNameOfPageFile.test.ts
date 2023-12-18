import type { IPage } from '@/scripts/types';
import { describe, expect, it } from 'vitest';
import { getUrlNameOfPageFile } from '../getUrlNameOfPageFile';

describe('utils getUrlNameOfPageFile', () => {
  it('should return the correct image url from the string', async () => {
    const page: IPage = {
      url: '/ambassadors',
      file: '/contribute/ambassadors/index.md',
      id: 'ambassadors',
    };
    const parentTree: IPage[] = [
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
    const page: IPage = {
      url: '/ambassadors',
      file: '/contribute/ambassadors/index.md',
      id: 'ambassadors',
    };
    const parentTree: IPage[] = [
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
});
