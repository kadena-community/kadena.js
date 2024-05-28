import type { IConfigTreeItem } from '@kadena/docs-tools';
import { cleanupPages } from '@kadena/docs-tools';
import { readFile } from 'fs/promises';
import yaml from 'js-yaml';
import { createDocsTree } from '..';
import { errors, success } from '../constants';

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
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should add a success to the successArray when ther are no errors', async () => {
    const result = await createDocsTree();
    console.log(result);
  });
  it('should fill the searchableDirs array with the parent pages', async () => {});
});
