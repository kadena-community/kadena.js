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

const createEditOverwrite = (filename) =>
  `${process.env.NEXT_PUBLIC_GIT_EDIT_ROOT}/packages/${filename}`;

export const createSlug = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\W_]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
};

const getTitle = (pageAST) => {
  const node = pageAST[0];
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
  return md.children.reduce((acc, val) => {
    if (val.type === 'heading' && val.depth === 2) {
      acc.push([val]);
    } else {
      if (acc.length) {
        acc[acc.length - 1].push(val);
      }
    }

    return acc;
  }, []);
};

const importDocs = (filename, destination, parentTitle, RootOrder) => {
  const doc = fs.readFileSync(`./../../${filename}`, 'utf-8');
  const md = remark.parse(doc);

  divideIntoPages(md).forEach((page, idx) => {
    const title = getTitle(page);
    const slug = idx === 0 ? 'index' : createSlug(title);
    const menuTitle = idx === 0 ? parentTitle : title;
    const order = idx === 0 ? RootOrder : idx;

    const doc = toMarkdown(createTreeRoot(page));

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
