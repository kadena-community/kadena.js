import type { IConfigTreeItem } from '@kadena/docs-tools';
import { checkUnusedImages } from '../../';

describe('checkUnusedImages success', () => {
  beforeEach(() => {
    vi.mock('../../utils/getAllAssets', () => {
      return {
        getAllAssets: () => {
          return [{ path: '/assets/docs/he-man.png', isUsed: false }];
        },
      };
    });
    vi.mock('../../../utils/crawlPage', () => {
      return {
        crawlPage: async (
          page: IConfigTreeItem,
          parentTree: IConfigTreeItem[],
          func: (
            page: IConfigTreeItem,
            parentTree: IConfigTreeItem[],
          ) => Promise<void>,
        ) => {
          await func(page, parentTree);
        },
      };
    });
    vi.mock('../../../movePages/utils/loadConfigPages', () => {
      return {
        loadConfigPages: (): IConfigTreeItem[] => {
          return [
            {
              id: 'learn',
              url: '/learn',
              file: '/learn/learn.md',
              children: [],
            },
          ];
        },
      };
    });

    vi.mock('fs', async () => {
      const actual = (await vi.importActual('fs')) as {};
      return {
        ...actual,
        readFileSync: (file: string) => {
          return `---
  title: mocktitle
  description: Kadena makes blockchain work for everyone.
  menu: mockmenu 
  label: Setup
  order: 2
  editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/tools/cookbook/README.md
  layout: full
  tags: [javascript,typescript,pact,reference,api]
---
              # Setup
              
              this is a test file
              ![OAuth roles and workflow](/assets/docs/he-man.png)
              `;
        },
      };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return a success line when image is not in the content', async () => {
    const result = await checkUnusedImages();
    expect(result.errors.length).toEqual(0);
    expect(result.success.length).toEqual(1);
  });
});
