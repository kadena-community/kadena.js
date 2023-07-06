import 'dotenv/config';

import * as fs from 'fs';
import { toMarkdown } from 'mdast-util-to-markdown';
import { remark } from 'remark';

const DOCSROOT = './src/pages/docs/';

const createFrontMatter = (
  title: string,
  menuTitle: string,
  order: number,
  editLink: string,
): string => {
  return `---
title: ${title}  
description: Kadena makes blockchain work for everyone.  
menu: ${menuTitle}  
label: ${title}  
order: ${order}
editLink: ${editLink}
layout: full  
---  
`;
};
const getTypes = (tree: any, type: string, arr: any[]): void => {
  tree.children.forEach((branch: any) => {
    if (branch.type === type) {
      arr.push(branch);
      return;
    }
    if (branch.children === undefined) return;

    return getTypes(branch, type, arr);
  });
};

const createEditOverwrite = (filename: string): string =>
  `${process.env.NEXT_PUBLIC_GIT_EDIT_ROOT}/packages/${filename}`;

const createSlug = (str: string): string => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]+/g, '')
    .replace(/ /g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
};

const getTitle = (pageAST: any): string => {
  const node = pageAST.children[0];
  if (node.type !== 'heading' || node.depth !== 2) {
    throw new Error('first node is not a Heading');
  }

  return node.children[0].value;
};

const createTreeRoot = (page: any): any => ({
  type: 'root',
  children: page,
});

const createDir = (dir: string): void => {
  fs.mkdirSync(dir, { recursive: true });
};

const divideIntoPages = (md: any): any[] => {
  const pages = md.children.reduce((acc: any[], val: any) => {
    if (val.type === 'heading' && val.depth === 2) {
      acc.push([val]);
    } else {
      if (acc.length > 0) {
        acc[acc.length - 1].push(val);
      }
    }

    return acc;
  }, []);

  const rootedPages = pages.map((page: any) => createTreeRoot(page));

  return rootedPages;
};

// find the correct title
// if the title is a h2 (start of the new page)
const findHeading = (tree: any, slug: string) => {
  const headings: any[] = [];
  getTypes(tree, 'heading', headings);

  const heading = headings.find((heading) => {
    return createSlug(heading.children[0].value) === slug;
  });

  if (heading !== undefined && heading.depth > 1) {
    return tree.children[0];
  }
  return;
};

// when we have a URL starting with '#',
// we need to recreate it, to send to the correct page
const recreateUrl = (pages: any[], url: string, root: string): string => {
  if (!url.startsWith('#')) return url;

  const slug = url.substring(1);

  return pages.reduce((acc, page, idx) => {
    const headingNode = findHeading(page, slug);

    if (headingNode !== undefined) {
      const pageTitle = headingNode.children[0].value;
      const pageSlug = createSlug(pageTitle);

      let url = `${root}`;
      if (idx > 0) {
        url = `${url}/${pageSlug}`;
      }

      if (pageSlug !== slug) {
        url = `${url}#${slug}`;
      }

      return url;
    }

    return acc;
  }, '');
};

// because we are creating new pages, we need to link the references to the correct pages
const relinkLinkReferences = (md: any, pages: any, root: string): void => {
  const linkReferences: any[] = [];
  const definitions: any[] = [];

  getTypes(md, 'linkReference', linkReferences);
  getTypes(md, 'definition', definitions);

  linkReferences.map((ref) => {
    const definition = definitions.find((def) => def.label === ref.label);
    if (definition === undefined) {
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

const importDocs = (
  filename: string,
  destination: string,
  parentTitle: string,
  rootOrder: number,
): void => {
  const doc = fs.readFileSync(`./../../${filename}`, 'utf-8');

  const md = remark.parse(doc);

  const pages = divideIntoPages(md);
  relinkLinkReferences(md, pages, `/docs/${destination}/`);

  pages.forEach((page: any, idx: number) => {
    const title = getTitle(page);
    const slug = idx === 0 ? 'index' : createSlug(title);
    const menuTitle = idx === 0 ? parentTitle : title;
    const order = idx === 0 ? rootOrder : idx;

    const doc = toMarkdown(page);

    createDir(`${DOCSROOT}${destination}`);

    fs.writeFileSync(
      `${DOCSROOT}${destination}/${slug}.mdx`,
      createFrontMatter(
        title,
        menuTitle,
        order,
        createEditOverwrite(filename),
      ) + doc,
      {
        flag: 'w',
      },
    );
  });
};

importDocs('libs/kadena.js/README.md', 'kadena/kadenajs', 'KadenaJS', 6);
importDocs('libs/client/README.md', 'kadena/client', 'Client', 7);
