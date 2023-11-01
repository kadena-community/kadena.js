import { exec } from 'child_process';
import { isValid } from 'date-fns';
import * as fs from 'fs';
import yaml from 'js-yaml';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
import { frontmatter } from 'micromark-extension-frontmatter';
import { promisify } from 'util';
import { getReadTime } from './utils.mjs';

const promiseExec = promisify(exec);
const errors = [];
const success = [];

const INITIALPATH = './src/pages';
const MENUFILEDIR = './src/_generated';
const MENUFILE = 'menu.mjs';
const TREE = [];

const isMarkDownFile = (name) => {
  const extension = name.split('.').at(-1);
  return extension.toLowerCase() === 'md' || extension.toLowerCase() === 'mdx';
};

export const getLastModifiedDate = async (root) => {
  const rootArray = root.split('/');
  const filename = rootArray.pop();
  const newRoot = rootArray.join('/');

  const { stdout } = await promiseExec(
    `cd ${newRoot} && git log -1 --pretty="format:%ci" ${filename}`,
  );

  console.log(1, { filename, newRoot });
  console.log({ stdout });

  const date = new Date(stdout);
  if (!isValid(date)) return;

  return date.toUTCString();
};

const isIndex = (file) => {
  return file.includes('/index');
};

const convertFile = async (file) => {
  const doc = fs.readFileSync(`${file}`, 'utf-8');
  let data;
  if (isMarkDownFile(file)) {
    data = getFrontMatter(doc, file);
  } else {
    const regex = /frontmatter\s*:\s*{[^}]+}/;
    const match = doc.match(regex);
    if (!match) return;

    let metaString = match[0].replace(/frontmatter:/, '');
    metaString = metaString.replace(/(\w+):/g, '"$1":').replace(/'/g, '"');
    metaString = metaString.replace(/,(\s*[}\]])/g, '$1');

    data = JSON.parse(metaString);
  }
  if (!data) return;

  const readTime = getReadTime(doc);
  const lastModifiedDate = await getLastModifiedDate(file);

  return {
    lastModifiedDate,
    ...data,
    ...readTime,
    isMenuOpen: false,
    isActive: false,
    isIndex: isIndex(file),
  };
};

const getFrontMatter = (doc, file) => {
  const tree = fromMarkdown(doc.toString(), {
    extensions: [frontmatter()],
    mdastExtensions: [frontmatterFromMarkdown()],
  });

  if (!tree.children[0] || tree.children[0].type !== 'yaml') {
    errors.push(`${file}: there is no frontmatter found`);
    return;
  }

  return yaml.load(tree.children[0].value);
};

const minimumZeroValue = (value) => {
  return value <= 0 ? 0 : value;
};

const pushToParent = (parent, child) => {
  let added = false;
  if (
    !parent.length ||
    child.order > parent.at(-1).order ||
    child.order === undefined
  ) {
    added = true;
    parent.push(child);

    return parent;
  }

  parent.forEach((item, idx) => {
    if (parseInt(child.order) <= parseInt(item.order) && !added) {
      const minIdx = minimumZeroValue(idx);
      parent.splice(minIdx, 0, child);
      added = true;
      return parent;
    }
  });
  return parent;
};

const findPath = (dir) => {
  const [, ...dirArray] = dir.split('/');
  let file = dirArray.pop();
  let path = dirArray.splice(2, dir.length - 1).join('/');

  const fileName = file.split('.').at(0);
  if (fileName === 'index') return null;
  if (!path) return `/${fileName}`;
  return `/${path}/${fileName}`;
};

const SEARCHABLE_DIRS = [
  '/blogchain',
  '/build',
  '/chainweb',
  '/contribute',
  '/kadena',
  '/marmalade',
  '/pact',
];

const getFile = async (rootDir, parent, file) => {
  const currentFile = `${rootDir}/${file}`;
  const arr = [];
  let child = {
    children: arr,
  };
  child.root = findPath(currentFile);

  if (!child.root) return;

  if (
    SEARCHABLE_DIRS.some((item) => {
      return currentFile.startsWith(`${INITIALPATH}${item}`);
    })
  ) {
    if (fs.statSync(`${currentFile}`).isFile()) {
      const obj = await convertFile(currentFile);
      Object.assign(child, obj);
    } else if (fs.existsSync(`${currentFile}/index.md`)) {
      const obj = await convertFile(`${currentFile}/index.md`);
      Object.assign(child, obj);
    } else if (fs.existsSync(`${currentFile}/index.mdx`)) {
      const obj = await convertFile(`${currentFile}/index.mdx`);
      Object.assign(child, obj);
    } else if (fs.existsSync(`${currentFile}/index.tsx`)) {
      const obj = await convertFile(`${currentFile}/index.tsx`);
      Object.assign(child, obj);
    } else {
      const files = fs.readdirSync(currentFile);

      // when the directory is empty, just remove the directory.
      // if there are files or subdirectories and no index file, give error
      if (files.length > 0) {
        errors.push(
          `${currentFile}: there is no index.[md|mdx|tsx] in this directory`,
        );
      }
    }

    parent = pushToParent(parent, child);

    if (fs.statSync(currentFile).isDirectory()) {
      child.children = await createTree(currentFile, child.children);

      return child.children;
    }
  }
};

const createTree = async (rootDir, parent = []) => {
  const files = fs.readdirSync(rootDir);

  for (let i = 0; i < files.length; i++) {
    await getFile(rootDir, parent, files[i]);
  }

  return parent;
};

export const createDocsTree = async () => {
  const result = await createTree(INITIALPATH, TREE);
  // write menu file
  const fileStr = `/* eslint @kadena-dev/typedef-var: "off" */
  export const menuData = ${JSON.stringify(result, null, 2)}`;

  fs.mkdirSync(MENUFILEDIR, { recursive: true });
  fs.writeFileSync(`${MENUFILEDIR}/${MENUFILE}`, fileStr);

  success.push('Docs imported from monorepo');

  return { errors, success };
};
