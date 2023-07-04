import * as fs from 'fs';
import { remark } from 'remark';
import { toMarkdown } from 'mdast-util-to-markdown';

const createFrontMatter = (title, menuTitle, order) => {
  return `---
title: ${title}  
description: Kadena makes blockchain work for everyone.  
menu: ${menuTitle}  
label: ${title}  
order: ${order}  
layout: full  
---  
`;
};

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

const devideIntoPages = (md) => {
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

const importDocs = (packageName, destination, parentTitle, RootOrder) => {
  const doc = fs.readFileSync(`./../../${packageName}/README.md`, 'utf-8');
  const md = remark.parse(doc);

  devideIntoPages(md).forEach(async (page, idx) => {
    const title = getTitle(page);
    const slug = idx === 0 ? 'index' : createSlug(title);
    console.log(slug);
    const menuTitle = idx === 0 ? parentTitle : title;
    const order = idx === 0 ? RootOrder : idx;

    const doc = toMarkdown(createTreeRoot(page));

    fs.writeFileSync(
      `./src/pages/docs/${destination}/${slug}.mdx`,
      createFrontMatter(title, menuTitle, order) + doc,
      {
        flag: 'w',
      },
    );
  });
};

importDocs('libs/kadena.js', 'kadena/kadenajs', 'KadenaJS', 6);
