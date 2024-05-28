import type { IConfigTreeItem } from '@kadena/docs-tools';
import { cleanupPages } from '@kadena/docs-tools';
import { readFile } from 'fs/promises';
import yaml from 'js-yaml';
import { SEARCHABLE_DIRS, errors } from '../constants';
import { getFile } from '../utils/getFile';

const mocks = vi.hoisted(() => {
  return {
    readFileSync: vi.fn(),
    convertFile: vi.fn(),
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    createTree: vi.fn(),
    statSyncIsFile: vi.fn(),
  };
});

describe('getFile', () => {
  let pages: IConfigTreeItem[];

  const callGetFile = async (pages: IConfigTreeItem[]) => {
    mocks.convertFile.mockReturnValue({ test: 'he-man' });
    const parent: any[] = [];
    await getFile(
      './src/pages/build/election',
      parent,
      'define-a-namespace',
      (pages[1].children ?? [])[6].children ?? [],
      0,
    );

    return parent;
  };

  beforeEach(async () => {
    errors.length = 0;
    const data = await readFile(
      './src/scripts/__mocks__/config.mock.yaml',
      'utf-8',
    );

    const result = yaml.load(data) as any;
    pages = cleanupPages(result.pages);
    pages.forEach((p) => {
      SEARCHABLE_DIRS.push(p.url);
    });

    vi.mock('fs', async () => {
      const actual = (await vi.importActual('fs')) as {};
      return {
        ...actual,
        readFileSync: mocks.readFileSync,
        existsSync: mocks.existsSync,
        readdirSync: mocks.readdirSync,
        statSync: () => ({
          isDirectory: () => true,
          isFile: mocks.statSyncIsFile,
        }),
      };
    });
    vi.mock('./../utils/convertFile', async () => {
      return {
        convertFile: mocks.convertFile,
      };
    });
    vi.mock('./../utils/createTree', async () => {
      return {
        createTree: mocks.createTree.mockReturnValue([]),
      };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return the parent with its child object and index.md', async () => {
    mocks.existsSync.mockReturnValueOnce(true);
    const parent = await callGetFile(pages);

    expect(mocks.existsSync).toHaveBeenCalledTimes(1);
    expect(mocks.existsSync).toHaveBeenNthCalledWith(
      1,
      './src/pages/build/election/define-a-namespace/index.md',
    );
    expect(mocks.createTree).toBeCalledTimes(1);
    expect(parent.length).toEqual(1);
    expect(parent).toEqual([
      {
        children: [],
        root: '/build/election/define-a-namespace',
        test: 'he-man',
      },
    ]);
  });

  it('should return the parent with its child object and index.mdx', async () => {
    mocks.existsSync.mockReturnValueOnce(false);
    mocks.existsSync.mockReturnValueOnce(true);
    mocks.createTree.mockReturnValue([]);
    const parent = await callGetFile(pages);

    expect(mocks.createTree).toBeCalledTimes(1);
    expect(mocks.existsSync).toHaveBeenCalledTimes(2);
    expect(mocks.existsSync).toHaveBeenNthCalledWith(
      2,
      './src/pages/build/election/define-a-namespace/index.mdx',
    );
    expect(parent.length).toEqual(1);
    expect(parent).toEqual([
      {
        children: [],
        root: '/build/election/define-a-namespace',
        test: 'he-man',
      },
    ]);
  });

  it('should return the parent with its child object and index.tsx', async () => {
    mocks.existsSync.mockReturnValueOnce(false);
    mocks.existsSync.mockReturnValueOnce(false);
    mocks.existsSync.mockReturnValueOnce(true);
    mocks.createTree.mockReturnValue([]);
    const parent = await callGetFile(pages);

    expect(mocks.createTree).toBeCalledTimes(1);
    expect(mocks.existsSync).toHaveBeenCalledTimes(3);
    expect(mocks.existsSync).toHaveBeenNthCalledWith(
      3,
      './src/pages/build/election/define-a-namespace/index.tsx',
    );
    expect(parent.length).toEqual(1);
    expect(parent).toEqual([
      {
        children: [],
        root: '/build/election/define-a-namespace',
        test: 'he-man',
      },
    ]);
  });

  it('should return the parent with its child object when statSyncIsFile', async () => {
    mocks.statSyncIsFile.mockReturnValueOnce(true);
    mocks.existsSync.mockReturnValue(false);
    mocks.createTree.mockReturnValue([]);
    const parent = await callGetFile(pages);

    expect(mocks.createTree).toBeCalledTimes(1);
    expect(mocks.existsSync).toHaveBeenCalledTimes(0);
    expect(mocks.statSyncIsFile).toHaveBeenCalledTimes(1);
    expect(parent.length).toEqual(1);
    expect(parent).toEqual([
      {
        children: [],
        root: '/build/election/define-a-namespace',
        test: 'he-man',
      },
    ]);
  });

  it('should find a directory with files, return an error', async () => {
    mocks.readdirSync.mockReturnValue(['skeletor.md']);
    mocks.statSyncIsFile(false);
    mocks.existsSync.mockReturnValue(false);
    expect(errors.length).toBe(0);
    await callGetFile(pages);

    expect(mocks.existsSync).toHaveBeenCalledTimes(3);
    expect(mocks.readdirSync).toHaveBeenCalled();
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe(
      './src/pages/build/election/define-a-namespace: there is no index.[md|mdx|tsx] in this directory',
    );
  });

  it('should return undefined when child.root is empty', async () => {
    const result = await getFile(
      '/non/existing/path',
      [],
      '/reference/nft-ref/policy-manager/nft-policy',
      pages,
      0,
    );

    expect(result).toBe(undefined);
  });
});
