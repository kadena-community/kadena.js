import 'dotenv/config';
import * as fs from 'fs';
import type { Alternative, Literal, Resource } from 'mdast';
import type {
  Content,
  Definition,
  Heading,
  Image,
  ImageReference,
  Link,
  LinkReference,
} from 'mdast-util-from-markdown/lib';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toString } from 'mdast-util-to-string';
import { remark } from 'remark';
import type { Root } from 'remark-gfm';
import { getLastModifiedDate } from '../getdocstree';
import type { IImportReadMeItem } from '../utils';
import { getTypes } from '../utils';
import { removeRepoDomain } from './index';

const DOCS_ROOT = './src/pages';

const createFrontMatter = (
  title: string,
  menuTitle: string,
  order: number,
  editLink: string,
  tags: string[] = [],
  lastModifiedDate?: string,
): string => {
  return `---
title: ${title}
description: Kadena makes blockchain work for everyone.
menu: ${menuTitle}
label: ${title}
order: ${order}
editLink: ${editLink}
layout: full
tags: [${tags.toString()}]
lastModifiedDate: ${lastModifiedDate}
---
`;
};

const createEditOverwrite = (item: IImportReadMeItem): string => {
  if (item.options.hideEditLink) return '';
  return `${item.repo}/edit/main${item.file}`;
};

export const createSlug = (str: string): string | undefined => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]+/g, '')
    .replace(/ /g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
};

const getTitle = (pageAST: Root): string => {
  // flatten all children recursively to prevent issue with
  // E.g. ## some title with `code`
  const node = pageAST.children[0];
  if (node.type !== 'heading' || node.depth !== 1) {
    throw new Error('first node is not a Heading');
  }

  return node.children.flatMap((child) => toString(child).trim()).join(' ');
};

const createTreeRoot = (page: Content[]): Root => ({
  type: 'root',
  children: page,
});

const createDir = (dir: string): void => {
  fs.mkdirSync(dir, { recursive: true });
};

const divideIntoPages = (md: Root): Root[] => {
  const pages = md.children.reduce((acc: Content[][], val: Content) => {
    if (val.type === 'heading' && val.depth === 2) {
      val.depth = 1;
      acc.push([val]);
    } else {
      if (acc.length) {
        acc[acc.length - 1].push(val);
      }
    }

    return acc;
  }, []);

  const rootedPages = pages.map((page) => createTreeRoot(page));

  return rootedPages;
};

// find the correct title
// if the title is a h2 (start of the new page)
const findHeading = (tree: Root, slug: string): Heading | undefined => {
  const headings = getTypes<Heading>(tree, 'heading');

  const heading = headings.find((heading) => {
    const firstChild = heading.children[0];
    if ('value' in firstChild) {
      return createSlug(firstChild.value) === slug;
    }
    return false;
  });

  if (heading && heading.depth > 1) {
    return tree.children[0] as Heading;
  }

  return;
};

// when we have a URL starting with '#',
// we need to recreate it, to send to the correct page
const recreateUrl = (pages: Root[], url: string, root: string): string => {
  if (!url.startsWith('#')) return url;

  const slug = url.substring(1);

  return pages.reduce((acc, page, idx) => {
    const headingNode = findHeading(page, slug);

    if (headingNode && 'children' in headingNode) {
      const pageTitle = (headingNode.children[0] as unknown as Literal).value;
      const pageSlug = createSlug(pageTitle);

      let url = `${root}`;
      if (idx > 0) {
        url = `${url}/${pageSlug}`;
      }

      if (pageSlug !== slug) {
        url = `${url}#${slug}`;
      }

      // remove double slashes from internal url, if any
      if (!url.includes('http')) {
        url = url.replace(/\/\//g, '/');
      }

      return url;
    }

    return acc;
  }, '');
};

const cleanUp = (content: Root | Content, filename: string): Root | Content => {
  let hasFirstHeader = false;
  const innerCleanUp = (content: Content, filename: string): Content => {
    if (content.type === 'heading' && content.depth === 1) {
      if (hasFirstHeader) {
        content.depth = 2;
      }

      hasFirstHeader = true;
    }

    if ('children' in content) {
      content.children.forEach((item) => {
        return innerCleanUp(item, filename);
      });
    }

    return content;
  };

  return innerCleanUp(content as Content, filename);
};

const relinkLinkReferences = (
  refs: LinkReference[],
  definitions: Definition[],
  pages: Root[],
  root: string,
): void => {
  refs.map((ref) => {
    const definition = definitions.find((def) => def.label === ref.label);
    if (!definition) {
      throw new Error('no definition found');
    }

    (ref as unknown as Link).type = 'link';
    (ref as unknown as Resource).url = recreateUrl(pages, definition.url, root);
    (ref.children[0] as Literal).value = `${
      (ref.children[0] as Literal).value
    } `; // a hack. if the name is the same as the URL, MD will not render it correctly
    delete ref.label;
    delete (ref as { identifier?: string }).identifier;
    delete (ref as { referenceType?: string }).referenceType;
  });
};

const relinkImageReferences = (
  refs: ImageReference[],
  definitions: Definition[],
): void => {
  refs.map((ref) => {
    const definition = definitions.find((def) => def.label === ref.label);
    if (!definition) {
      throw new Error('no definition found');
    }

    (ref as unknown as Image).type = 'image';
    (ref as unknown as Resource).url = definition.url;
    (ref as unknown as Alternative).alt = (
      definition as unknown as Alternative
    ).alt;
    delete ref.label;
    delete (ref as { identifier?: string }).identifier;
    delete (ref as { referenceType?: string }).referenceType;
  });
};

// because we are creating new pages, we need to link the references to the correct pages
const relinkReferences = (md: Root, pages: Root[], root: string): void => {
  const definitions = getTypes<Definition>(md, 'definition');
  const linkReferences = getTypes<LinkReference>(md, 'linkReference');
  const imageReferences = getTypes<ImageReference>(md, 'imageReference');

  relinkLinkReferences(linkReferences, definitions, pages, root);
  relinkImageReferences(imageReferences, definitions);
};

const createPage = async (
  page: Root,
  item: IImportReadMeItem,
  hasMultiplePages?: boolean,
  idx?: number,
): Promise<void> => {
  if (hasMultiplePages) {
    createDir(`${DOCS_ROOT}/${item.destination}`);
  }
  console.log(333333333);

  const lastModifiedDate = await getLastModifiedDate(
    `.${removeRepoDomain(item.repo)}${item.file}`,
  );

  const title = getTitle(page);
  const slug =
    idx === 0 || item.options.RootOrder === 0 ? 'index' : createSlug(title);
  const menuTitle =
    idx === 0 || item.options.RootOrder === 0 ? item.title : title;
  const order = idx === 0 ? item.options.RootOrder : idx ? idx : 0;

  // check that there is just 1 h1.
  // if more, keep only 1 and replace the next with an h2
  const pageContent = cleanUp(
    page,
    `/${item.destination}/${order === 0 ? '' : slug}`,
  );

  const doc = toMarkdown(pageContent);

  fs.writeFileSync(
    `${DOCS_ROOT}/${item.destination}/${order === 0 ? 'index' : slug}.md`,
    createFrontMatter(
      title,
      menuTitle,
      order,
      createEditOverwrite(item),
      item.options.tags,
      lastModifiedDate,
    ) + doc,
    {
      flag: 'w',
    },
  );
};

const removeFrontmatter = (doc: string): string => {
  // Find the first occurrence of '---' to locate the end of frontmatter
  const frontmatterEnd = doc.indexOf('---', doc.indexOf('---') + 1);

  if (frontmatterEnd !== -1) {
    // Extract the frontmatter and remove it from the content
    //const frontmatter = markdownContent.slice(0, frontmatterEnd + 3);
    return doc.slice(frontmatterEnd + 3).trim();
  }

  return doc;
};

export const importDocs = async (
  filename: string,
  item: IImportReadMeItem,
): Promise<void | undefined> => {
  console.log({ filename });
  const doc = removeFrontmatter(fs.readFileSync(`${filename}`, 'utf-8'));

  const md: Root = remark.parse(doc);

  console.log(1111, item.destination);
  if (item.options.singlePage) {
    relinkReferences(md, [md], `/${item.destination}/`);
    await createPage(md, item);
    return;
  }

  const pages = divideIntoPages(md);
  relinkReferences(md, pages, `/${item.destination}/`);

  pages.forEach(async (page: Root, idx: number) => {
    await createPage(page, item, true, idx);
  });
};
