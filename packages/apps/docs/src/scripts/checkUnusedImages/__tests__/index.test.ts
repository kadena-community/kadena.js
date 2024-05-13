import type { IConfigTreeItem } from '@kadena/docs-tools';
import { checkUnusedImages } from '../';

describe('checkUnusedImages', () => {
  beforeEach(() => {
    vi.mock('../utils/getAllAssets', () => {
      return {
        getAllAssets: () => {
          return [{ path: '/assets/docs/7-raw.png', isUsed: false }];
        },
      };
    });
    vi.mock('../../utils/crawlPage', () => {
      return {
        crawlPage: async (
          page: IConfigTreeItem,
          parentTree: IConfigTreeItem[],
          func: (
            page: IConfigTreeItem,
            parentTree: IConfigTreeItem[],
          ) => Promise<void>,
        ) => {
          return [{ path: '/assets/docs/7-raw.png', isUsed: false }];
        },
      };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return true if the image is in the content', async () => {
    const result = await checkUnusedImages();
    console.log(result);
  });
});
