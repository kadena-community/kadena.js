import { getAllPages, getPageConfig } from '../config';

const headerMenuItems = [
  { root: '/learn', menu: 'Learn', title: 'Learn about Kadena' },
  { root: '/build', menu: 'Build', title: 'Build with Kadena' },
];

const leftMenuTree = [
  {
    children: [
      {
        children: [
          {
            root: '/build/pact/advanced',
            title: 'Advanced concepts',
            menu: 'Advanced concepts',
            label: 'Advanced concepts',
            tags: [],
            isMenuOpen: false,
            isActive: false,
            isIndex: true,
          },
        ],
        root: '/build/pact',
        title: 'Get started with Pact',
        menu: 'Smart contracts',
        label: 'Get started with Pact',
        tags: [],
        isMenuOpen: false,
        isActive: false,
        isIndex: true,
      },
    ],
    root: '/learn',
    title: 'Learn about Kadena',
    id: 'learn',
    menu: 'Learn',
    label: 'Introduction',
    tags: [],
    isMenuOpen: false,
    isActive: false,
    isIndex: true,
  },
];

const mocks = vi.hoisted(() => {
  return {
    getHeaderMenuItems: vi.fn(),
    checkSubTreeForActive: vi.fn(),
    getMenuData: vi.fn(),
  };
});

describe('config', () => {
  beforeEach(() => {
    vi.mock('@kadena/docs-tools', async () => {
      const actual = (await vi.importActual('@kadena/docs-tools')) as {};
      return {
        ...actual,
        getHeaderMenuItems: mocks.getHeaderMenuItems,
        checkSubTreeForActive: mocks.checkSubTreeForActive,
        getMenuData: mocks.getMenuData,
      };
    });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  describe('getAllPages', () => {
    it('should return all pages flattened', async () => {
      mocks.getMenuData.mockResolvedValue(leftMenuTree);
      const result = await getAllPages();
      console.log(result);

      const expectedResult = [
        {
          root: '/learn',
          title: 'Learn about Kadena',
          id: 'learn',
          menu: 'Learn',
          label: 'Introduction',
          tags: [],
          isMenuOpen: false,
          isActive: false,
          isIndex: true,
        },
        {
          root: '/build/pact',
          title: 'Get started with Pact',
          menu: 'Smart contracts',
          label: 'Get started with Pact',
          tags: [],
          isMenuOpen: false,
          isActive: false,
          isIndex: true,
        },
        {
          root: '/build/pact/advanced',
          title: 'Advanced concepts',
          menu: 'Advanced concepts',
          label: 'Advanced concepts',
          tags: [],
          isMenuOpen: false,
          isActive: false,
          isIndex: true,
        },
      ];

      expect(result).toEqual(expectedResult);
    });
  });
  describe('getPageConfig', () => {
    it('should return a page config json without popular pages if that prop is not set', async () => {
      mocks.getHeaderMenuItems.mockResolvedValue(headerMenuItems);
      mocks.checkSubTreeForActive.mockResolvedValue(leftMenuTree);

      const result = await getPageConfig({ filename: '/participate' });
      expect(result).toEqual({
        headerMenuItems: headerMenuItems,
        leftMenuTree,
        popularPages: null,
      });
    });

    it('should return a page config json with popular pages if that prop is set', async () => {
      mocks.getHeaderMenuItems.mockResolvedValue(headerMenuItems);
      mocks.checkSubTreeForActive.mockResolvedValue(leftMenuTree);

      const result = await getPageConfig({
        popularPages: '/',
        filename: '/participate',
      });
      expect(result).toEqual({
        headerMenuItems: headerMenuItems,
        leftMenuTree,
        popularPages: [],
      });
    });
  });
});
