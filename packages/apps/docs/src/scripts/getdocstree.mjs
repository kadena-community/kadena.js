import * as fs from 'fs';
import yaml from 'js-yaml';
import { getReadTime } from './utils.mjs';
import { frontmatter } from 'micromark-extension-frontmatter';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';

const isMarkDownFile = (name) => {
  const extension = name.split('.').at(-1);
  return extension.toLowerCase() === 'md' || extension.toLowerCase() === 'mdx';
};

const convertFile = (file) => {
  const doc = fs.readFileSync(`${file}`, 'utf-8');
  let data;
  if (isMarkDownFile(file)) {
    data = getFrontMatter(doc);
  } else {
    const regex = /frontmatter\s*:\s*{[^}]+}/;
    const match = doc.match(regex);
    if (!match) return;

    let metaString = match[0].replace(/frontmatter:/, '');
    metaString = metaString.replace(/(\w+):/g, '"$1":').replace(/'/g, '"');
    metaString = metaString.replace(/,(\s*[}\]])/g, '$1');

    data = JSON.parse(metaString);
  }

  const readTime = getReadTime(doc);

  return {
    ...data,
    ...readTime,
    isMenuOpen: false,
    isActive: false,
  };
};

const getFrontMatter = (doc) => {
  const tree = fromMarkdown(doc.toString(), {
    extensions: [frontmatter()],
    mdastExtensions: [frontmatterFromMarkdown()],
  });

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
  return `/${path}/${fileName}`;
};

const INITIALPATH = './src/pages/docs';
const MENUFILE = './src/data/menu.mjs';
const TREE = [];

const createTree = (rootDir, parent = []) => {
  const files = fs.readdirSync(rootDir);

  files.forEach((file) => {
    const currentFile = `${rootDir}/${file}`;

    const arr = [];
    let child = {
      children: arr,
    };
    child.root = findPath(currentFile);

    if (!child.root) return;

    console.log(currentFile);
    if (fs.statSync(`${currentFile}`).isFile()) {
      const obj = convertFile(currentFile);
      Object.assign(child, obj);
    } else if (fs.existsSync(`${currentFile}/index.md`)) {
      const obj = convertFile(`${currentFile}/index.md`);
      Object.assign(child, obj);
    } else if (fs.existsSync(`${currentFile}/index.mdx`)) {
      const obj = convertFile(`${currentFile}/index.mdx`);
      Object.assign(child, obj);
    } else if (fs.existsSync(`${currentFile}/index.tsx`)) {
      const obj = convertFile(`${currentFile}/index.tsx`);
      Object.assign(child, obj);
    } else {
      throw new Error(currentFile);
    }
    parent = pushToParent(parent, child);

    if (fs.statSync(currentFile).isDirectory()) {
      child.children = createTree(currentFile, child.children);

      return child.children;
    }
  });

  return parent;
};

const result = createTree(INITIALPATH, TREE);

const fileStr = `/* eslint @kadena-dev/typedef-var: "off" */
export const menuData = ${JSON.stringify(result, null, 2)}`;

fs.writeFileSync(MENUFILE, fileStr);
