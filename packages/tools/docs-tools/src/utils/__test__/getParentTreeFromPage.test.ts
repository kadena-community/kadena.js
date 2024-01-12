import type { IConfigTreeItem } from 'src/types';
import { getParentTreeFromPage } from '../getParentTreeFromPage';
import { loadConfigPages } from './../../mock/loadConfigPages.mock';

vi.mock('@/scripts/movePages/utils/loadConfigPages', () => {
  return {
    loadConfigPages: () => {
      return loadConfigPages();
    },
  };
});

describe('utils getParentTreeFromPage', () => {
  beforeEach(() => {});

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return the parentTree for the given page', async () => {
    const page: IConfigTreeItem = {
      url: '/community-channel-leader',
      file: '/contribute/ambassadors/community-channel-leader.md',
      id: 'leader',
    };
    const result = await getParentTreeFromPage(page);
    const expectedResult = [
      {
        url: '/contribute',
        file: '/contribute/index.tsx',
        id: 'contribute',
      },
      {
        url: '/ambassadors',
        file: '/contribute/ambassadors/index.md',
        id: 'ambassadors',
      },
    ];

    expect(result).toStrictEqual(expectedResult);
  });

  it('should return the parentTree for the given page', async () => {
    const page: IConfigTreeItem = {
      url: '/build2',
      file: '/test.md',
      id: 'build2',
    };
    const result = await getParentTreeFromPage(page);
    const expectedResult = [{ url: '/test', file: '/test.md', id: 'build' }];

    expect(result).toStrictEqual(expectedResult);
  });

  it('should return the parentTree for the given page 1 deep', async () => {
    const page: IConfigTreeItem = {
      url: '/node',
      file: '/contribute/node/index.md',
      id: 'node',
    };
    const result = await getParentTreeFromPage(page);
    const expectedResult = [
      {
        url: '/contribute',
        file: '/contribute/index.tsx',
        id: 'contribute',
      },
    ];

    expect(result).toStrictEqual(expectedResult);
  });

  it('should return the parentTree for the given page, when page is a root', async () => {
    const page: IConfigTreeItem = {
      url: '/test',
      file: '/test.md',
      id: 'build',
    };
    const result = await getParentTreeFromPage(page);
    const expectedResult: IConfigTreeItem[] = [];
    expect(result).toStrictEqual(expectedResult);
  });
});
