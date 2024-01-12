import type { IConfigTreeItem } from '@kadena/docs-tools';

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
