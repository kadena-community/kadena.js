import type { IConfigTreeItem } from '@kadena/docs-tools';
import {
  createSlug,
  getFileExtension,
  getFileFromNameOfUrl,
  getParentTreeFromPage,
  getUrlNameOfPageFile,
} from '@kadena/docs-tools';
import * as fs from 'fs';
import type { Definition, Heading, Image, Link, Text } from 'mdast';
import { toMarkdown } from 'mdast-util-to-markdown';
import { remark } from 'remark';
import type { Root } from 'remark-gfm';
import { loadConfigPages } from '../movePages/utils/loadConfigPages';
import { crawlPage } from '../utils/crawlPage';
import type { IScriptResult } from './../types';
import { getTypes } from './../utils';
import { getFileNameOfPageFile } from './../utils/getFileNameOfPageFile';
import { splitContentFrontmatter } from './../utils/splitContentFrontmatter';
import { refactorAbsoluteDocsLink } from './refactorAbsoluteDocsLink';
import { getCleanedHash } from './utils/getCleanedHash';
import { getLinkHash } from './utils/getLinkHash';
import { getPageFromPath } from './utils/getPageFromPath';
import { getUrlofImageFile } from './utils/getUrlofImageFile';
import { isLocalImageLink, isLocalPageLink } from './utils/isLocalPageLink';

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
  const file = await getFileFromNameOfUrl(cleanedLink);

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

  return `${cleanedLink}#${createSlug(foundHeader ?? '')}`;
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

    //fix docs.kadena.io links to relative links.
    //this way SPA links will still work and we can check relative links for 404's
    link.url = refactorAbsoluteDocsLink(link.url);

    if (isLocalPageLink(link.url)) {
      link.url = getUrlofPageFile(link.url);
      link.url = await fixHashLinks(link.url);
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

export const fixLocalLinks = async (): Promise<IScriptResult> => {
  errors.length = 0;
  success.length = 0;
  const pages = loadConfigPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    await crawlPage(page, [], fixLinks);
  }

  if (!errors.length) {
    success.push('Locallinks are fixed');
  }
  return { errors, success };
};

export const fixLocalLinksSingle =
  (path: string) => async (): Promise<IScriptResult> => {
    errors.length = 0;
    success.length = 0;
    const page = await getPageFromPath(path);

    if (!page) {
      errors.push('page not found in config');
    } else {
      const parentTree = await getParentTreeFromPage(page);
      await crawlPage(page, parentTree, fixLinks);
      success.push('Locallinks are fixed');
    }

    return { errors, success };
  };
