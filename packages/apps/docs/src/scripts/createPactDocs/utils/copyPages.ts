import { importRepo, noImportRepo } from '@/scripts/importReadme/importRepo';
import type { IImportReadMeItem } from '@/scripts/utils';
import type { IConfigTreeItem } from '@kadena/docs-tools';
import {
  getParentTreeFromPage,
  getUrlNameOfPageFile,
} from '@kadena/docs-tools';
import * as fs from 'fs';
import { CONTENTPLACEHOLDER, PACTREPO } from './constants';

export const copyPages = async (
  pages: IConfigTreeItem[],
  parentDir: string = '',
): Promise<void> => {
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (page.repo === PACTREPO) {
      const parentTree = await getParentTreeFromPage(page);
      page.destination = getUrlNameOfPageFile(page, parentTree ?? []);

      let content;
      // //if (process.env.IGNOREREPO === 'true') {
      //   content = await noImportRepo(page, parentTree);
      // } else {
      console.log(222, page);
      content = await importRepo(page as unknown as IImportReadMeItem);
      console.log(content);
      //}

      const destination = `./src/pages${page.destination}/index.md`;
      const pageContent = fs.readFileSync(destination, 'utf8');

      const newContent = pageContent.replace(CONTENTPLACEHOLDER, content);

      fs.writeFileSync(destination, newContent);
    }

    if (page.children) {
      await copyPages(page.children, `${parentDir}${page.url}`);
    }
  }
};
