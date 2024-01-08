import { readFile } from 'fs/promises';
import { join } from 'path';
import type { IConfigTreeItem, IMenuItem } from 'src/types';
import { getUrlNameOfPageFile } from './config/getUrlNameOfPageFile';
import { getConfig } from './getConfig';
import { getFileExtension } from './getFileExtension';
import { getFrontmatter, getFrontmatterFromTsx } from './getFrontmatter';
import { getParentTreeFromPage } from './getParentTreeFromPage';
import { isMarkDownFile } from './markdown/isMarkdownFile';
import { getPages } from './staticGeneration/getData';

export const getPageTreeById = async (
  id: string,
): Promise<IConfigTreeItem[]> => {
  const pages = await getPages();
  const idArray = id.split('.');

  const pageTree: IConfigTreeItem[] = [];
  while (idArray.length > 0) {
    const id = idArray.shift();

    const pagesArray = pageTree.length
      ? pageTree[pageTree.length - 1].children
      : pages;
    const found = pagesArray?.find((p) => p.id === id);
    if (!found) throw new Error(`header id ${id} not found`);

    pageTree.push(found);
  }

  return pageTree;
};

export const getHeaderMenuItems = async (): Promise<IMenuItem[]> => {
  const { menu } = await getConfig();
  const headers = [];
  for (let i = 0; i < menu.length; i++) {
    const id = menu[i];
    const pageArray = (await getPageTreeById(id)) ?? [];

    const page = pageArray.pop();
    const root = getUrlNameOfPageFile(page, pageArray);
    if (!page) throw new Error('no file path found for id ${id}');

    const parentTree = await getParentTreeFromPage(page);

    const url = getUrlNameOfPageFile(page, parentTree);
    const extension = getFileExtension(page.file);

    const filePath = join(process.cwd(), `src/pages${url}/index.${extension}`);

    const content = await readFile(filePath, 'utf-8');
    const frontmatter = isMarkDownFile(page.file)
      ? await getFrontmatter(content)
      : getFrontmatterFromTsx(content);

    if (!frontmatter)
      throw new Error(`no frontmatter found for ${page.file} (id: ${id})`);

    headers.push({
      root,
      menu: frontmatter.menu,
      title: frontmatter.title,
    } as unknown as IMenuItem);
  }

  return headers;
};
