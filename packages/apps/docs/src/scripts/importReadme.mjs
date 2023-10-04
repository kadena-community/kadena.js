import * as fs from 'fs';
import 'dotenv/config';
import { remark } from 'remark';
import { toMarkdown } from 'mdast-util-to-markdown';
import { getTypes } from './utils/getTypes.mjs';
import { importReadMes } from './utils.mjs';
import chalk from 'chalk';
import { createSlug } from './utils/createSlug.mjs';
import { getLastModifiedDate } from './utils/getLastModifiedDate.mjs';
import { getTitle } from './utils/markdownUtils.mjs';
import { relinkReferences } from './utils/relinkReferences.mjs';

const errors = [];

const DOCSROOT = './src/pages/docs/';

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

const createEditOverwrite = (filename, options) => {
  if (options.hideEditLink) return '';
  return `${process.env.NEXT_PUBLIC_GIT_EDIT_ROOT}/packages/${filename}`;
};

const createTreeRoot = (page) => ({
  type: 'root',
  children: page,
});

export const createDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

export const divideIntoPages = (md) => {
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

/**
 * Function cleans up the just seperated pages.
 * makes sure that the first header (probably an h2, because we seperate the pages on h2) and turn them in an h1
 * @returns
 */
export const cleanUp = (content, filename) => {
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

const importDocs = async (filename, destination, parentTitle, options) => {
  const doc = fs.readFileSync(`./../../${filename}`, 'utf-8');

  const md = remark.parse(doc);

  const lastModifiedDate = await getLastModifiedDate(`./../../${filename}`);

  const pages = divideIntoPages(md);
  relinkReferences(md, pages, `/docs/${destination}/`);

  pages.forEach((page, idx) => {
    const title = getTitle(page);
    const slug = idx === 0 ? 'index' : createSlug(title);
    const menuTitle = idx === 0 ? parentTitle : title;
    const order = idx === 0 ? options.RootOrder : idx;

    // check that there is just 1 h1.
    // if more, keep only 1 and replace the next with an h2
    const pageContent = cleanUp(page, `/docs/${destination}/${slug}`);

    const doc = toMarkdown(pageContent);

    createDir(`${DOCSROOT}${destination}`);

    fs.writeFileSync(
      `${DOCSROOT}${destination}/${slug}.md`,
      createFrontMatter(
        title,
        menuTitle,
        order,
        createEditOverwrite(filename, options),
        options.tags,
        lastModifiedDate,
      ) + doc,
      {
        flag: 'w',
      },
    );
  });
};

const importAll = async (imports) => {
  console.log(
    '=============================== START IMPORT DOCS FROM MONOREPO ==\n\n',
  );
  imports.forEach(async (item) => {
    await importDocs(item.file, item.destination, item.title, item.options);
  });

  if (errors.length) {
    errors.map((error) => {
      console.warn(chalk.red('⨯'), error);
    });
    process.exitCode = 1;
  } else {
    console.log(chalk.green('✓'), 'DOCS IMPORTED FROM MONOREPO');
  }

  console.log(
    '\n\n=============================== END IMPORT DOCS FROM MONOREPO ====',
  );
};

//importAll(importReadMes);
