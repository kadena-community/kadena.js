import type { IConfigTreeItem } from '@kadena/docs-tools';
import * as fs from 'fs';

export const crawlPage = async (
  page: IConfigTreeItem,
  parentTree: IConfigTreeItem[],
  func: (page: IConfigTreeItem, parentTree: IConfigTreeItem[]) => Promise<void>,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  await func(page, parentTree);

  if (page.children) {
    for (let i = 0; i < page.children.length; i++) {
      const child = page.children[i];
      await crawlPage(child, [...parentTree, page], func);
    }
  }
};

export const blogCrawl = async (
  func: any,
  path: string = './src/pages/blogchain',
): Promise<void> => {
  const files = fs.readdirSync(path);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = `${path}/${file}`;
    if (fs.lstatSync(filePath).isDirectory()) {
      await blogCrawl(func, filePath);
    } else {
      func(filePath);
    }
  }
};
