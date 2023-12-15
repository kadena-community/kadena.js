import { exec } from 'child_process';
import * as fs from 'fs';
import type { Definition, Link } from 'mdast-util-from-markdown/lib';
import { toMarkdown } from 'mdast-util-to-markdown';
import { remark } from 'remark';
import type { Root } from 'remark-gfm';
import { promisify } from 'util';
import { getFileExtension, loadConfigPages } from './movePages';
import type { IPage, IScriptResult } from './types';
import { getTypes } from './utils';

export const promiseExec = promisify(exec);

const errors: string[] = [];
const success: string[] = [];

const isLocalFileLink = (link: Link | Definition): boolean => {
  const url = link.url;
  const extension = getFileExtension(url);
  return (
    !url.startsWith('http') &&
    (extension === 'md' ||
      extension === 'mdx' ||
      extension === 'tsx' ||
      extension === 'jsx')
  );
};

const getFileNameOfPageFile = (page: IPage, parentTree: IPage[]): string => {
  return `${
    parentTree.reduce((acc, val) => {
      return `${acc}${val.url}`;
    }, '') + page.url
  }/index.${getFileExtension(page.file)}`;
};

const getUrlNameOfPageFile = (page: IPage, parentTree: IPage[]): string => {
  if (!page) return '';
  return `${
    parentTree.reduce((acc, val) => {
      return `${acc}${val.url}`;
    }, '') + page.url
  }`;
};

const findPageByFile = (
  file: string,
  pages?: IPage[],
  parentTree: IPage[] = [],
): { page?: IPage; parentTree: IPage[] } | undefined => {
  if (!pages) return;
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  let found: { page?: IPage; parentTree: IPage[] } | undefined;
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

  const cleanLink = link.replace(/\.\.\//g, '').replace(/\.\//g, '');

  const result = findPageByFile(cleanLink, pages);
  if (!result) {
    errors.push(`${link} not found in the config`);
    return '';
  }

  if (!result.page) return '';
  return getUrlNameOfPageFile(result.page, result.parentTree);
};

const splitContentFrontmatter = (
  content: string,
): { frontmatter: string | null; content: string } => {
  const frontmatterRegex = /^---([\s\S]+?)---/;
  const frontmatterMatch = content.match(frontmatterRegex);

  const frontmatter = frontmatterMatch ? frontmatterMatch[1] : null;
  const contentWithoutFrontmatter = frontmatter
    ? content.replace(frontmatterRegex, '').trim()
    : content.trim();

  return {
    content: contentWithoutFrontmatter,
    frontmatter: frontmatter,
  };
};

const fixLinks = async (page: IPage, parentTree: IPage[]): Promise<void> => {
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
  const links = getTypes<Link>(md, 'link');
  const linkReferences = getTypes<Definition>(md, 'definition');

  [...links, ...linkReferences].forEach((link) => {
    if (isLocalFileLink(link)) {
      link.url = getUrlofPageFile(link.url);
    }
  });

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

const crawlPage = (page: IPage, parentTree: IPage[]): void => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  fixLinks(page, parentTree);

  if (page.children) {
    page.children.forEach((child) => {
      crawlPage(child, [...parentTree, page]);
    });
  }
};

export const fixLocalLinks = async (): Promise<IScriptResult> => {
  const pages = loadConfigPages();

  pages.forEach((page) => {
    crawlPage(page, []);
  });

  success.push('Locallinks are fixed');
  return { errors, success };
};
