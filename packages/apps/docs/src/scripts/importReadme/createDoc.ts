import 'dotenv/config';
import * as fs from 'fs';
import type {
  Alternative,
  Content,
  Definition,
  Heading,
  Image,
  ImageReference,
  Link,
  LinkReference,
  Literal,
  Resource,
} from 'mdast';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toString } from 'mdast-util-to-string';
import { remark } from 'remark';
import type { Root } from 'remark-gfm';
import { getLastModifiedDate } from '../getdocstree/utils/getLastModifiedDate';
import type { IImportReadMeItem } from '../utils';
import { getTypes } from '../utils';
import { createSlug } from '../utils/createSlug';
import { removeRepoDomain } from './index';

export const DOCS_ROOT = './src/pages';

const createFrontMatter = (
  title: string,
  menuTitle: string,
  editLink: string,
  tags: string[] = [],
  lastModifiedDate?: string,
): string => {
  return `---
title: ${title}
description: Kadena makes blockchain work for everyone.
menu: ${menuTitle}
label: ${title}
editLink: ${editLink}
layout: full
tags: [${tags.toString()}]
lastModifiedDate: ${lastModifiedDate}
---
`;
};

const createEditOverwrite = (item: IImportReadMeItem): string => {
  return `${item.repo}/edit/main${item.file}`;
};

const getTitle = (pageAST: Root): string => {
  const headings = getTypes<Heading>(pageAST, 'heading');
  if (
    headings.length === 0 ||
    (headings.length > 0 && headings[0].depth !== 1)
  ) {
    throw new Error('first node is not a Heading');
  }

  return headings[0].children
    .flatMap((child) => toString(child).trim())
    .join(' ');
};

export const createDir = (dir: string): void => {
  fs.mkdirSync(dir, { recursive: true });
};

//get the first title heading you find in the doc
export const getFirstHeading = (doc: string): Heading | undefined => {
  const md: Root = remark.parse(doc);
  const headings = getTypes<Heading>(md, 'heading');

  if (!headings.length) return;
  const value = (headings[0].children[0] as Literal).value;
  (headings[0].children[0] as any).value = value
    .replace('@kadena/', '')
    .replace(/-/g, ' ');
  return headings[0];
};

//check the first header.
// if it is an h2 make it an h1
const setTitleHeader = (tree: Root, firstHeading?: Heading): void => {
  const headings = getTypes<Heading>(tree, 'heading');

  if (headings.length > 0 && headings[0].depth !== 1) {
    //if the first found heading is not the same as the heading that is still in the tree add the first heading to the tree
    //remember, we removed the generic header from the tree. in there, there is a Heading as well
    if (
      firstHeading?.children[0] &&
      firstHeading?.depth === 1 &&
      firstHeading?.children[0] !== headings[0].children[0]
    ) {
      tree.children.unshift(firstHeading as any);
    } else {
      headings[0].depth = 1;
    }
  }

  return;
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
): Promise<void> => {
  const lastModifiedDate = await getLastModifiedDate(
    `.${removeRepoDomain(item.repo)}${item.file}`,
  );

  const title = getTitle(page);
  const slug = 'index';
  const menuTitle = title;

  createDir(`${DOCS_ROOT}/${item.destination}`);

  // check that there is just 1 h1.
  // if more, keep only 1 and replace the next with an h2
  const pageContent = cleanUp(page, `/${item.destination}/${slug}`);

  const doc = toMarkdown(pageContent as Root);

  fs.writeFileSync(
    `${DOCS_ROOT}/${item.destination}/index.md`,
    createFrontMatter(
      title,
      menuTitle,
      createEditOverwrite(item),
      [],
      lastModifiedDate,
    ) + doc,
    {
      flag: 'w',
    },
  );
};

const removeFrontmatter = (doc: string): string => {
  // Find the first occurrence of '---' to locate the end of frontmatter
  const frontmatterEnd = doc.indexOf('\n---', doc.indexOf('---') + 1);

  if (frontmatterEnd !== -1) {
    // Extract the frontmatter and remove it from the content
    return doc.slice(frontmatterEnd + 3).trim();
  }

  return doc;
};

const removeGenericHeader = (doc: string): string => {
  const regExp = new RegExp(
    /<!-- genericHeader start -->[\s\S]*?<!-- genericHeader end -->/g,
  );

  return doc.replace(regExp, '');
};

export const importDocs = async (
  filename: string,
  item: IImportReadMeItem,
): Promise<void | undefined> => {
  const doc = removeGenericHeader(
    removeFrontmatter(fs.readFileSync(`${filename}`, 'utf-8')),
  );

  const firstHeading = getFirstHeading(
    removeFrontmatter(fs.readFileSync(`${filename}`, 'utf-8')),
  );

  const md: Root = remark.parse(doc);
  setTitleHeader(md, firstHeading);

  relinkReferences(md, [md], `/${item.destination}/`);
  await createPage(md, item);
  return;
};
