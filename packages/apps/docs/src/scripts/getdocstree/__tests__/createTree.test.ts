import type { IConfigTreeItem } from '@kadena/docs-tools';
import { cleanupPages } from '@kadena/docs-tools';
import { readFile } from 'fs/promises';
import yaml from 'js-yaml';
import { createTree } from '../utils/createTree';

const mocks = vi.hoisted(() => {
  return {
    readdirSync: vi.fn(),
    getFile: vi.fn(),
  };
});

describe('createTree', async () => {
  let pages: IConfigTreeItem[];
  const data = await readFile(
    './src/scripts/__mocks__/config.mock.yaml',
    'utf-8',
  );

  const result = yaml.load(data) as any;
  pages = cleanupPages(result.pages);

  beforeEach(async () => {
    vi.mock('fs', async () => {
      const actual = (await vi.importActual('fs')) as {};
      return {
        ...actual,
        readdirSync: mocks.readdirSync,
      };
    });
    vi.mock('./../utils/getFile', async () => {
      const actual = (await vi.importActual('fs')) as {};
      return {
        ...actual,
        getFile: mocks.getFile.mockReturnValue([]),
      };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('', async () => {
    const refPages = (pages[4].children ?? [])[9];
    mocks.readdirSync.mockReturnValue([
      'index.tsx',
      'js-bindings',
      'node-client',
      'stream-client',
    ]);
    const parent: IParent[] = [];
    await createTree(
      './src/pages/reference/chainweb-ref',
      parent,
      refPages.children ?? [],
    );

    expect(mocks.getFile).toBeCalledTimes(3);
    expect(mocks.getFile).toHaveBeenNthCalledWith(
      1,
      './src/pages/reference/chainweb-ref',
      [],
      'node-client',
      [],
      0,
    );
  });
});
