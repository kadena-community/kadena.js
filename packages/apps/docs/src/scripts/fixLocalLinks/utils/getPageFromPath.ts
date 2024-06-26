import type { IConfigTreeItem } from '@kadena/docs-tools';
import { getPages } from '@kadena/docs-tools';

export const getPageFromPath = async (
  path: string,
): Promise<IConfigTreeItem | undefined> => {
  const pages = await getPages();

  const cleanedPath = path.includes('src/docs')
    ? path.split('src/docs')[1]
    : path;
  let page: IConfigTreeItem | undefined = undefined;
  const find = (pages: IConfigTreeItem[], path: string): void => {
    pages.forEach((p) => {
      console.log(p.file);
      if (p.file === path) page = p;

      find(p.children ?? [], path);
    });
  };

  find(pages, cleanedPath);

  console.log({ page });
  return page;
};
