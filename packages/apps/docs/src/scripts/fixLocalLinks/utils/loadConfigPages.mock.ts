import type { IConfig, IConfigTreeItem } from '@kadena/docs-tools';
import * as fs from 'fs';
import yaml from 'js-yaml';

export const loadConfigPages = (): IConfigTreeItem[] => {
  const data = fs.readFileSync(
    `${process.cwd()}/src/scripts/fixLocalLinks/utils/__tests__/config.mock.yaml`,
    'utf-8',
  );
  const { pages } = yaml.load(data) as IConfig;

  const cleanup = (pages: IConfigTreeItem[]): IConfigTreeItem[] => {
    const innerPages = Object.entries(pages);

    return innerPages.map(([key, page]: [string, IConfigTreeItem]) => {
      if (page.children) page.children = cleanup(page.children);

      return { ...page, id: key } as IConfigTreeItem;
    });
  };

  return cleanup(pages);
};
