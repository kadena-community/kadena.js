import type { IConfigTreeItem } from '@kadena/docs-tools';
import { cleanupPages } from '@kadena/docs-tools';
import { readFile } from 'fs/promises';
import yaml from 'js-yaml';
import { createDocsTree } from '..';
import { SEARCHABLE_DIRS, errors, success } from '../constants';

const mocks = vi.hoisted(() => {
  return {
    getPages: vi.fn(),
    createTree: vi.fn(),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
  };
});

describe('createDocsTree', () => {
  let pages: IConfigTreeItem[];
  beforeEach(async () => {
    errors.length = 0;
    success.length = 0;
    SEARCHABLE_DIRS.length = 0;
    const data = await readFile(
      './src/scripts/__mocks__/config.mock.yaml',
      'utf-8',
    );

    const result = yaml.load(data) as any;
    pages = cleanupPages(result.pages);

    vi.mock('fs', async () => {
      const actual = (await vi.importActual('fs')) as {};
      return {
        ...actual,
        mkdirSync: mocks.mkdirSync,
        writeFileSync: mocks.writeFileSync,
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

  it('should add a success to the successArray when ther are no errors', async () => {
    mocks.createTree.mockReturnValue(pages[1].children);
    const result = await createDocsTree();
    expect(result.success.length).toBe(1);
    expect(result.success[0]).toEqual('Docs imported from monorepo');
    expect(result.errors.length).toBe(0);
  });

  it('should have an error to the errorArray when ther are no success', async () => {
    mocks.createTree.mockReturnValue([]);
    errors.push('there was an error');
    const result = await createDocsTree();
    expect(result.success.length).toBe(0);
    expect(result.errors.length).toBe(1);
  });

  it('should fill the searchableDirs array with the parent pages', async () => {
    expect(SEARCHABLE_DIRS.length).toBe(0);
    await createDocsTree();
    expect(SEARCHABLE_DIRS.length).toBe(6);
  });

  it('should create a dir and save file', async () => {
    mocks.createTree.mockResolvedValue([]);
    await createDocsTree();
    expect(mocks.mkdirSync).toBeCalledWith('./src/_generated', {
      recursive: true,
    });
    expect(mocks.writeFileSync).toBeCalledWith(
      './src/_generated/menu.json',
      '[]',
    );
  });
});
