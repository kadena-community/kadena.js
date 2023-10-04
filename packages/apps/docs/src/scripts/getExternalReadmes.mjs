import * as fs from 'fs';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Spinner } from './utils/spinner.mjs';
import { remark } from 'remark';
import { toMarkdown } from 'mdast-util-to-markdown';
import {
  getSubDirLastModifiedDate,
  getLastModifiedDate,
} from './utils/getLastModifiedDate.mjs';
import { getTitle } from './utils/markdownUtils.mjs';
import {
  divideIntoPages,
  relinkReferences,
  cleanUp,
  createSlug,
  createDir,
  getTypes,
} from './importReadme.mjs';

const promiseExec = promisify(exec);

const TEMPDIR = './.tempimport';
const DOCSROOT = './src/pages/docs';
const REPOPREFIX = 'https://github.com/';
const REPOURLPREFIX = 'https://github.com';

const errors = [];

/**
 * @type {Object} ImportItemOptions
 * @property {number} order the order in the menu
 * @property {boolean?} singlePage see if we want to split the page at h2
 * @property {array.<string>} tags an array of tags
 */

/**
 * @type {Object} ImportItem
 * @property {string} fileName name of the file to be imported
 * @property {string?} repo name of the repo in github
 * @property {string} destination the position of the md file inside the `pages/docs`
 * @property {string} parentTitle the title of the parent menu
 * @property {ImportItemOptions} ImportItemOptions the title of the parent menu
 */

const createFrontMatter = (props) => {
  return `---\n${Object.keys(props)
    .map((prop) => `${prop}: ${props[prop]}\n`)
    .join('')}
---
`;
};

const createEditOverwrite = (repo, filename) => {
  return `${REPOURLPREFIX}/${repo}/blob/main/${filename}`;
};

/**
 * remove the obsolete markup, before the first header
 */
const removeObsoleteMarkup = (content) => {
  let hasHeader = false;
  content.children = content.children.reduce((acc, val) => {
    if (val.type === 'heading') {
      val.depth = 1;
      acc.push(val);
      hasHeader = true;
    } else if (hasHeader) {
      acc.push(val);
    }

    return acc;
  }, []);

  return content;
};

const createPage = (item, lastModifiedDate) => (loadedPage, idx) => {
  const page = removeObsoleteMarkup(loadedPage);

  const title = getTitle(page);
  const slug = idx === 0 ? 'index' : createSlug(title);
  const menuTitle = idx === 0 ? item.parentTitle : title;
  const order = idx === 0 ? item.options.order : idx;

  // check that there is just 1 h1.
  // if more, keep only 1 and replace the next with an h2
  const pageContent = cleanUp(page, `/docs/${item.destination}/${slug}`);

  const doc = toMarkdown(pageContent);

  createDir(`${DOCSROOT}${item.destination}`);

  fs.writeFileSync(
    `${DOCSROOT}/${item.destination}/${slug}.md`,
    createFrontMatter({
      title,
      label: title,
      menu: menuTitle,
      layout: 'full',
      order,
      lastModifiedDate,
      editLink: createEditOverwrite(item.repo, item.filename),
      tags: item.options.tags,
    }) + doc,
    {
      flag: 'w',
    },
  );
};

const LinksToReferences = (c) => {
  const definitions = getTypes(c, 'definition');
  let index = 0;

  const replaceLinkWithReference = (content) => {
    const idx = definitions.length;
    definitions.push({
      type: 'definition',
      identifier: `${idx}`,
      label: `${idx}`,
      title: null,
      url: content.url,
      position: {},
    });

    return {
      type: 'linkReference',
      children: [
        {
          type: 'text',
          value: content.children[0].value,
          position: {},
        },
      ],
      position: {},
      label: `${idx}`,
      identifier: `${idx}`,
      referenceType: 'full',
    };
  };

  const innerLinkToReferences = (outerContent) => {
    let content = { ...outerContent };

    if (content.type === 'link') {
      content = replaceLinkWithReference(content, index);
      index++;
    }

    if (content.children) {
      content.children = content.children.map((item) => {
        return innerLinkToReferences(item);
      });
    }
    return content;
  };

  c = innerLinkToReferences(c);

  c.children.push(...definitions);
  return c;
};

const createLastModifiedDate = (item) => {
  if (item.repo) {
    return getSubDirLastModifiedDate(item.filename, `${TEMPDIR}/${item.repo}`);
  }
  return getLastModifiedDate(item.file);
};

const importDocs = async (item) => {
  const doc = fs.readFileSync(`${item.file}`, 'utf-8');
  const lastModifiedDate = await createLastModifiedDate(item);
  const md = LinksToReferences(remark.parse(doc));

  if (item.options.singlePage) {
    relinkReferences(md, md, `/docs${item.destination}/`);
    createPage(item, lastModifiedDate)(md, 0);
  } else {
    const pages = divideIntoPages(md);
    relinkReferences(md, pages, `/docs/${item.destination}/`);

    pages.forEach(createPage(item, lastModifiedDate));
  }
};

/**
 * Removes the tempdir.
 */
const deleteTempDir = () => {
  //fs.rmSync(TEMPDIR, { recursive: true, force: true });
};

/**
 * @param {ImportItem} importItem
 */
const clone = async ({ repo }) => {
  deleteTempDir();

  await promiseExec(`git clone ${REPOPREFIX}${repo} ${TEMPDIR}/${repo}`);
};

const init = async () => {
  console.log(
    '========================================= START EXTERNAL IMPORT ==\n\n',
  );

  const spinner = Spinner();
  //spinner.start();

  /**
   * @constant
   * @type {Array.<ImportItem>}
   */
  const importArray = [
    {
      filename: `README.md`,
      repo: 'kadena-community/getting-started',
      destination: '/build/quickstart',
      parentTitle: 'Quickstart',
      options: {
        order: 0,
        tags: ['devnet', 'chainweaver', 'tutorial', 'docker', 'transactions'],
      },
    },
    // {
    //   filename: `README.md`,
    //   repo: 'kadena-io/pact',
    //   destination: '/pact/test',
    //   parentTitle: 'Pact start',
    //   options: {
    //     order: 5,
    //     tags: ['pact'],
    //   },
    // },
    // {
    //   file: '../../libs/chainweb-node-client/README.md',
    //   destination: 'chainweb/node-client',
    //   parentTitle: 'Node Client',
    //   options: {
    //     order: 1,
    //     tags: ['chainweb', 'pact', 'reference'],
    //   },
    // },
  ];

  for (let i = 0; i < importArray.length; i++) {
    const item = importArray[i];

    if (item.repo) {
      //await clone(item);

      item.file = `${TEMPDIR}/${item.repo}/${item.filename}`;
    }

    await importDocs(item);
  }

  deleteTempDir();

  spinner.stop();

  if (errors.length) {
    errors.map((error) => {
      console.warn(chalk.red('⨯'), error);
    });
    process.exitCode = 1;
  } else {
    console.log(chalk.green('✓'), 'EXTERNAL IMPORT DONE');
  }

  console.log(
    '\n\n========================================= END EXTERNAL IMPORT ====',
  );
};

init();
