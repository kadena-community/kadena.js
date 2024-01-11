import { createSlug } from '@/utils/createSlug';
import type { IConfigTreeItem } from '@kadena/docs-tools';
import {
  getFileExtension,
  getParentTreeFromPage,
  getUrlNameOfPageFile,
} from '@kadena/docs-tools';
import * as fs from 'fs';
import type {
  Definition,
  Heading,
  Image,
  Link,
  Text,
} from 'mdast-util-from-markdown/lib';
import { toMarkdown } from 'mdast-util-to-markdown';
import { remark } from 'remark';
import type { Root } from 'remark-gfm';
import { loadConfigPages } from '../movePages/utils/loadConfigPages';
import type { IScriptResult } from './../types';
import { getTypes } from './../utils';
import { getCleanedHash } from './utils/getCleanedHash';
import { getFileFromNameOfUrl } from './utils/getFileFromNameOfUrl';
import { getFileNameOfPageFile } from './utils/getFileNameOfPageFile';
import { getLinkHash } from './utils/getLinkHash';
import { getUrlofImageFile } from './utils/getUrlofImageFile';
import { isLocalImageLink, isLocalPageLink } from './utils/isLocalPageLink';
import { removeFileExtenion } from './utils/removeFileExtenion';
import { splitContentFrontmatter } from './utils/splitContentFrontmatter';

const errors: string[] = [];
const success: string[] = [];

const getContent = (filePath: string): string => {
  return fs.readFileSync(`./src/pages${filePath}/index.md`, 'utf-8');
};

const fixHashLinks = async (link: string): Promise<string> => {
  // check if the link has a hashdeeplink
  const arr = link.split('#');

  if (arr.length < 2) return link;

  const cleanedLink = arr[0];
  const cleanedHashUrl = getCleanedHash(arr[1]);

  // get the page to the hashlink
  const file = getFileFromNameOfUrl(cleanedLink);

  if (!file) return `#${createSlug(cleanedHashUrl)}`;

  const parentTree = await getParentTreeFromPage(file);
  const pagesLocation = getUrlNameOfPageFile(file, parentTree ?? []);
  const fullContent = getContent(pagesLocation);

  const { content } = splitContentFrontmatter(fullContent);

  const md: Root = remark.parse(content);
  const headers = getTypes<Heading>(md, 'heading');

  const foundHeader = headers
    .map((header) => {
      return (header.children[0] as Text).value;
    })
    .find((header) => {
      return cleanedHashUrl === getCleanedHash(createSlug(header));
    });

  if (!foundHeader) {
    errors.push(`${link} deeplink was not found in config`);
  }

  return `${cleanedLink}#${createSlug(foundHeader)}`;
};

const findPageByFile = (
  file: string,
  pages?: IConfigTreeItem[],
  parentTree: IConfigTreeItem[] = [],
): { page?: IConfigTreeItem; parentTree: IConfigTreeItem[] } | undefined => {
  if (!pages) return;
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  let found:
    | { page?: IConfigTreeItem; parentTree: IConfigTreeItem[] }
    | undefined;
  pages.forEach((p) => {
    if (p.file.endsWith(file)) {
      found = { page: p, parentTree };
    } else {
      if (!found) found = findPageByFile(file, p.children, [...parentTree, p]);
    }
  });

  return found;
};

const getUrlofPageFile = (link: string): string => {
  const pages = loadConfigPages();
  const fileHash = getLinkHash(link);

  const cleanLink = link
    .replace(/\.\.\//g, '')
    .replace(/\.\//g, '')
    .replace(`#${fileHash}`, '');

  // the blogchain is not in the config.
  // so do not check to change
  if (cleanLink.startsWith('/blogchain')) return removeFileExtenion(cleanLink);
  if (cleanLink.startsWith('blogchain'))
    return `/${removeFileExtenion(cleanLink)}`;

  const result = findPageByFile(cleanLink, pages);
  if (!result) {
    errors.push(
      `${link}${fileHash ? `#${fileHash}` : ``} not found in the config`,
    );
    return '';
  }

  if (!result.page) return '';

  return `${getUrlNameOfPageFile(result.page, result.parentTree)}${
    fileHash ? `#${fileHash}` : ''
  }`;
};

const fixLinks = async (
  page: IConfigTreeItem,
  parentTree: IConfigTreeItem[],
): Promise<void> => {
  const extenstion = getFileExtension(page.file);
  if (extenstion !== 'md' && extenstion !== 'mdx') return;

  const contentWithFrontmatter = fs.readFileSync(
    `./src/pages${getFileNameOfPageFile(page, parentTree)}`,
    'utf-8',
  );

  // we need to preserve the frontmatter, because remark conversion doesnt work to well with the frontmatter
  const { frontmatter, content } = splitContentFrontmatter(
    contentWithFrontmatter,
  );

  const md: Root = remark.parse(content);
  const images = getTypes<Image>(md, 'image');
  const links = getTypes<Link>(md, 'link');
  const linkReferences = getTypes<Definition>(md, 'definition');

  images.forEach((image) => {
    if (isLocalImageLink(image)) {
      image.url = getUrlofImageFile(image.url);
    }
  });

  const linkArray = [...links, ...linkReferences];
  for (let i = 0; i < linkArray.length; i++) {
    const link = linkArray[i];

    if (isLocalPageLink(link.url)) {
      link.url = getUrlofPageFile(link.url);
      link.url = await fixHashLinks(link.url);

      console.log('link', { url: link.url });
    }
  }

  const newContent = toMarkdown(md);

  fs.writeFileSync(
    `./src/pages${getFileNameOfPageFile(page, parentTree)}`,
    `---
${frontmatter}
---
${newContent}
    `,
    {
      flag: 'w',
    },
  );
};

const crawlPage = async (
  page: IConfigTreeItem,
  parentTree: IConfigTreeItem[],
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  await fixLinks(page, parentTree);

  if (page.children) {
    for (let i = 0; i < page.children.length; i++) {
      const child = page.children[i];
      await crawlPage(child, [...parentTree, page]);
    }
  }
};

export const fixLocalLinks = async (): Promise<IScriptResult> => {
  errors.length = 0;
  success.length = 0;
  const pages = loadConfigPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    await crawlPage(page, []);
  }

  success.push('Locallinks are fixed');
  return { errors, success };
};
