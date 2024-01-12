import { loadConfigPages } from '@/scripts/fixLocalLinks/utils/loadConfigPages.mock';
import { getFileNameOfPageFile } from '../getFileNameOfPageFile';

vi.mock('@/scripts/movePages', () => {
  return {
    loadConfigPages: loadConfigPages,
  };
});

describe('utils getFileNameOfUrl', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return filePath for this Page', async () => {
    const page = {
      url: '/moderator',
      file: '/contribute/ambassadors/moderator.md',
      id: 'moderator',
    };

    const parentTree = [
      {
        url: '/ambassadors',
        file: '/contribute/ambassadors/index.md',
        id: 'ambassadors',
      },
      {
        url: '/node',
        file: '/contribute/node/index.md',
        id: 'node',
      },
    ];

    const result = getFileNameOfPageFile(page, parentTree);

    expect(result).toStrictEqual('/ambassadors/node/moderator/index.md');
  });
});
