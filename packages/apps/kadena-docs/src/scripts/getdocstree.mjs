import * as fs from 'fs';
import yaml from 'js-yaml';
import { frontmatter } from 'micromark-extension-frontmatter';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';

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
  console.log('next?', child.label);
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
const MENUFILE = './src/data/menu.json';
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

    if (fs.statSync(`${currentFile}`).isFile()) {
      const doc = fs.readFileSync(`${currentFile}`, 'utf-8');
      Object.assign(child, getFrontMatter(doc));
    } else if (fs.statSync(`${currentFile}/index.md`).isFile()) {
      const doc = fs.readFileSync(`${currentFile}/index.md`, 'utf-8');
      Object.assign(child, getFrontMatter(doc));
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

fs.writeFileSync(MENUFILE, JSON.stringify(result, null, 2));
