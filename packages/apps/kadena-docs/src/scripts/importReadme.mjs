import * as fs from 'fs';
import { remark } from 'remark';
import { toMarkdown } from 'mdast-util-to-markdown';

const createFrontMatter = (title, order) => {
  return `---
title: ${title}  
description: Kadena makes blockchain work for everyone.  
menu: ${title}  
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

const importDocs = (packageName, destination, title, order) => {
  const doc = fs.readFileSync(`./../../${packageName}/README.md`, 'utf-8');

  const md = remark.parse(doc);

  // const hasStarted = false;
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

  //console.log(md.children);
  // md.children = pages;

  pages.forEach(async (page, idx) => {
    const title = getTitle(page);
    const slug = idx === 0 ? 'index' : createSlug(title);
    console.log(slug);
    const frontmatter = createFrontMatter(title, order);

    const tree = {
      type: 'root',
      children: page,
    };

    const doc = toMarkdown(tree);

    fs.writeFileSync(
      `./src/pages/docs/${destination}/${slug}.mdx`,
      frontmatter + doc,
      {
        flag: 'w',
      },
    );
  });
};

importDocs('libs/kadena.js', 'kadena/kadenajs', 'KadenaJS', 5);
