import * as fs from 'fs';
import 'dotenv/config';
import { remark } from 'remark';
import { toMarkdown } from 'mdast-util-to-markdown';

const DOCSROOT = './src/pages/docs/';

const createFrontMatter = (title, menuTitle, order, editLink) => {
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
const getTypes = (tree, type, arr = []) => {
  tree.children.forEach((branch) => {
    if (branch.type === type) {
      arr.push(branch);
    }
    if (!branch.children) return arr;

    return getTypes(branch, type, arr);
  });
  return arr;
};

const createEditOverwrite = (filename) =>
  `${process.env.NEXT_PUBLIC_GIT_EDIT_ROOT}/packages/${filename}`;

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
  const node = pageAST.children[0];
  if (node.type !== 'heading' || node.depth !== 2) {
    throw new Error('first node is not a Heading');
  }

  return node.children[0].value;
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

      return url;
    }

    return acc;
  }, '');
};

// because we are creating new pages, we need to link the references to the correct pages
const relinkLinkReferences = (md, pages, root) => {
  const definitions = getTypes(md, 'definition');
  const linkReferences = getTypes(md, 'linkReference');

  linkReferences.map((ref) => {
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

const importDocs = (filename, destination, parentTitle, RootOrder) => {
  const doc = fs.readFileSync(`./../../${filename}`, 'utf-8');

  const md = remark.parse(doc);

  const pages = divideIntoPages(md);
  relinkLinkReferences(md, pages, `/docs/${destination}/`);

  pages.forEach((page, idx) => {
    const title = getTitle(page);
    const slug = idx === 0 ? 'index' : createSlug(title);
    const menuTitle = idx === 0 ? parentTitle : title;
    const order = idx === 0 ? RootOrder : idx;

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
