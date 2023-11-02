import { exec } from 'child_process';
import 'dotenv/config';
import * as fs from 'fs';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toString } from 'mdast-util-to-string';
import { remark } from 'remark';
import { promisify } from 'util';
import { getLastModifiedDate } from './../getdocstree.mjs';
import { getTypes } from './../utils.mjs';
import { removeRepoDomain } from './index.mjs';

const promiseExec = promisify(exec);
const DOCSROOT = './src/pages';
export const TEMPDIR = './.tempimport';

const createFrontMatter = (
  title,
  menuTitle,
  order,
  editLink,
  tags = [],
  lastModifiedDate,
) => {
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

const createEditOverwrite = (item) => {
  if (item.options.hideEditLink) return '';
  return `${item.repo}/edit/main${item.file}`;
};

export const createSlug = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]+/g, '')
    .replace(/ /g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
};

const getTitle = (pageAST) => {
  // flatten all children recursively to prevent issue with
  // E.g. ## some title with `code`
  const node = pageAST.children[0];
  if (node.type !== 'heading' || node.depth !== 1) {
    throw new Error('first node is not a Heading');
  }

  return node.children.flatMap((child) => toString(child).trim()).join(' ');
};

const createTreeRoot = (page) => ({
  type: 'root',
  children: page,
});

const createDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

const divideIntoPages = (md) => {
  const pages = md.children.reduce((acc, val) => {
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

const cleanUp = (content, filename) => {
  let hasFirstHeader = false;
  const innerCleanUp = (content, filename) => {
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

    return content;
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

export const importDocs = async (filename, item) => {
  const doc = fs.readFileSync(`${filename}`, 'utf-8');

  const md = remark.parse(doc);

  const lastModifiedDate = await getLastModifiedDate(
    `.${removeRepoDomain(item.repo)}${item.file}`,
  );

  if (item.options.singlePage) {
    relinkReferences(md, [md], `/${item.destination}/`);

    const title = getTitle(md);

    const menuTitle = item.title;
    const order = item.options.RootOrder;
    const slug = createSlug(title);

    // check that there is just 1 h1.
    // if more, keep only 1 and replace the next with an h2

    const pageContent = cleanUp(
      md,
      `/${item.destination}/${order === 0 ? '' : slug}`,
    );

    const doc = toMarkdown(pageContent);

    fs.writeFileSync(
      `${DOCSROOT}/${item.destination}/${order === 0 ? 'index' : slug}.md`,
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

    return;
  }

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

    createDir(`${DOCSROOT}/${item.destination}`);

    fs.writeFileSync(
      `${DOCSROOT}/${item.destination}/${slug}.md`,
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
  });
};
