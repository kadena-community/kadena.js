import { createSlug } from '@/utils/createSlug';
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
import { getFileExtension, getLinkHash, loadConfigPages } from './movePages';
import type { IPage, IScriptResult } from './types';
import { getTypes } from './utils';

const errors: string[] = [];
const success: string[] = [];

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

const isLocalPageLink = (url: string): boolean => {
  const extension = getFileExtension(url);
  return (
    !url.startsWith('http') &&
    (extension === 'md' ||
      extension === 'mdx' ||
      extension === 'tsx' ||
      extension === 'jsx')
  );
};

const getFileNameOfUrl = (link: string): IPage | undefined => {
  const pages = loadConfigPages();
  const [, ...linkArr] = link.split('/');

  const innerFind = (
    pages: IPage[] | undefined,
    parentPage?: IPage,
  ): IPage | undefined => {
    const parentUrl = linkArr.shift();
    if (!parentUrl || !pages) return parentPage;
    const found = pages.find((page) => page.url === `/${parentUrl}`);
    if (!found) return parentPage;
    return innerFind(found.children, found);
  };

  return innerFind(pages);
};

//removing the hDIGIT part, so we can add it programmatically (for backward compatibility)
const getCleanedHash = (hash: string): string => {
  const regExp = /^([^\d]+)h(-?\d+)$/;
  const match = hash.match(regExp);
  if (!match) return hash;
  return match[1];
};

const fixHashLinks = (link: string): string => {
  // check if the link has a hashdeeplink
  const arr = link.split('#');
  if (arr.length < 2) return link;

  const cleanedLink = arr[0];
  const cleanedHashUrl = getCleanedHash(arr[1]);

  // get the page to the hashlink
  const file = getFileNameOfUrl(cleanedLink);

  if (!file) return link;

  const fullContent = fs.readFileSync(`./src/docs${file.file}`, 'utf-8');
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

const isLocalImageLink = (link: Image): boolean => {
  const url = link.url;
  return !url.startsWith('http') && url.includes('public/assets');
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

const getUrlofImageFile = (link: string): string => {
  const cleanLink = link
    .replace(/\.\.\//g, '')
    .replace(/\.\//g, '')
    .replace(/public/, '');

  return cleanLink;
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
    errors.push(`${link}#${fileHash} not found in the config`);
    return '';
  }

  if (!result.page) return '';
  return `${getUrlNameOfPageFile(result.page, result.parentTree)}${
    fileHash ? `#${fileHash}` : ''
  }`;
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
  const images = getTypes<Image>(md, 'image');
  const links = getTypes<Link>(md, 'link');
  const linkReferences = getTypes<Definition>(md, 'definition');

  images.forEach((image) => {
    if (isLocalImageLink(image)) {
      image.url = getUrlofImageFile(image.url);
    }
  });

  [...links, ...linkReferences].forEach((link) => {
    if (isLocalPageLink(link.url)) {
      link.url = getUrlofPageFile(link.url);
    }

    link.url = fixHashLinks(link.url);
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
  errors.length = 0;
  success.length = 0;
  const pages = loadConfigPages();

  pages.forEach((page) => {
    crawlPage(page, []);
  });

  success.push('Locallinks are fixed');
  return { errors, success };
};
