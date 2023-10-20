import 'dotenv/config';
import * as fs from 'fs';
import type { Content, Heading, Root } from 'mdast';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toString } from 'mdast-util-to-string';
import { remark } from 'remark';
import { IPageMeta } from '../../src/Layout';
import { ErrorsReturn, ImportReadMe, SucccessReturn } from '../types.mjs';
import { getTypes } from '../utils/getTypes.mjs';
import { createSlug } from './../../src/utils/createSlug.mjs';
import { getLastModifiedDate } from './../utils/getLastModifiedDate.mjs';
import { importReadMes } from './data.mjs';

const errors: ErrorsReturn = [];
const success: SucccessReturn = [];
const DOCSROOT = './src/pages/';

const createFrontMatter = ({
  title,
  menu,
  order,
  editLink,
  tags = [],
  lastModifiedDate,
}: IPageMeta) => {
  return `---
title: ${title}
description: Kadena makes blockchain work for everyone.
menu: ${menu}
label: ${title}
order: ${order}
editLink: ${editLink}
layout: full
tags: [${tags.toString()}]
lastModifiedDate: ${lastModifiedDate}
---
`;
};

const createEditOverwrite = (
  filename: string,
  options: ImportReadMe['options'],
) => {
  if (options.hideEditLink) return '';
  return `${process.env.NEXT_PUBLIC_GIT_EDIT_ROOT}/packages/${filename}`;
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

const createDir = (dir: string) => {
  fs.mkdirSync(dir, { recursive: true });
};

const divideIntoPages = (md: Root) => {
  const pages: [Heading][] = md.children.reduce(
    (acc: [Heading][], val: Content) => {
      if (val.type === 'heading' && val.depth === 2) {
        val.depth = 1;
        acc.push([val]);
      } else {
        if (acc.length) {
          acc[acc.length - 1].push(val as Heading);
        }
      }

      return acc;
    },
    [],
  );

  const rootedPages = pages.map((page) => createTreeRoot(page));

  return rootedPages;
};

// find the correct title
// if the title is a h2 (start of the new page)
const findHeading = (tree, slug) => {
  const headings = getTypes(tree, 'heading');

  const heading = headings.find((heading) => {
    return createSlug(heading.children[0].value) === slug;
  });

  if (heading && heading.depth > 1) {
    return tree.children[0];
  }
  return;
};

// when we have a URL starting with '#',
// we need to recreate it, to send to the correct page
const recreateUrl = (pages, url, root) => {
  if (!url.startsWith('#')) return url;

  const slug = url.substring(1);

  return pages.reduce((acc, page, idx) => {
    const headingNode = findHeading(page, slug);

    if (headingNode) {
      const pageTitle = headingNode.children[0].value;
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

const cleanUp = (content: Root, filename: string): Root => {
  let hasFirstHeader = false;
  const innerCleanUp = (content: Content, filename: string): Root => {
    if (content.type === 'heading' && content.depth === 1) {
      if (hasFirstHeader) {
        content.depth = 2;
      }

      hasFirstHeader = true;
    }

    if (content.children) {
      content.children.forEach((item) => {
        return innerCleanUp(item, filename);
      });
    }

    return content as Root;
  };

  return innerCleanUp(content, filename);
};

const relinkLinkReferences = (refs, definitions, pages, root) => {
  refs.map((ref) => {
    const definition = definitions.find((def) => def.label === ref.label);
    if (!definition) {
      throw new Error('no definition found');
    }

    ref.type = 'link';
    ref.url = recreateUrl(pages, definition.url, root);
    ref.children[0].value = `${ref.children[0].value} `; // a hack. if the name is the same as the URL, MD will not render it correctly
    delete ref.label;
    delete ref.identifier;
    delete ref.referenceType;
  });
};

const relinkImageReferences = (refs, definitions) => {
  refs.map((ref) => {
    const definition = definitions.find((def) => def.label === ref.label);
    if (!definition) {
      throw new Error('no definition found');
    }

    ref.type = 'image';
    ref.url = definition.url;
    ref.alt = definition.alt;
    delete ref.label;
    delete ref.identifier;
    delete ref.referenceType;
  });
};

// because we are creating new pages, we need to link the references to the correct pages
const relinkReferences = (md, pages, root) => {
  const definitions = getTypes(md, 'definition');
  const linkReferences = getTypes(md, 'linkReference');
  const imageReferences = getTypes(md, 'imageReference');

  relinkLinkReferences(linkReferences, definitions, pages, root);
  relinkImageReferences(imageReferences, definitions, pages, root);
};

const importDocs = async (item: ImportReadMe) => {
  const doc = fs.readFileSync(`./../../${item.file}`, 'utf-8');

  const md = remark.parse(doc) as Root;

  const lastModifiedDate = await getLastModifiedDate(`./../../${item.file}`);

  const pages = divideIntoPages(md);
  relinkReferences(md, pages, `/${item.destination}/`);

  pages.forEach((page, idx) => {
    const title = getTitle(page);
    const slug = idx === 0 ? 'index' : createSlug(title);
    const menuTitle = idx === 0 ? item.title : title;
    const order = idx === 0 ? item.options.RootOrder : idx;

    // check that there is just 1 h1.
    // if more, keep only 1 and replace the next with an h2
    const pageContent = cleanUp(page, `/${item.destination}/${slug}`);

    const doc = toMarkdown(pageContent);

    createDir(`${DOCSROOT}${item.destination}`);

    fs.writeFileSync(
      `${DOCSROOT}${item.destination}/${slug}.md`,
      createFrontMatter({
        title,
        menu: menuTitle,
        order,
        editLink: createEditOverwrite(item.file, item.options),
        tags: item.options.tags,
        lastModifiedDate,
      }) + doc,
      {
        flag: 'w',
      },
    );
  });
};

export const importAllReadmes = async () => {
  importReadMes.forEach(async (item) => await importDocs(item));

  success.push('Docs imported from monorepo');

  return { success, errors };
};
