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

    console.log(currentFile);

    const arr = [];
    let child = {
      children: arr,
    };
    child.root = findPath(currentFile);
    if (!child.root) return;

    parent.push(child);

    if (fs.statSync(`${currentFile}`).isFile()) {
      const doc = fs.readFileSync(`${currentFile}`, 'utf-8');
      Object.assign(child, getFrontMatter(doc));
    } else if (fs.statSync(`${currentFile}/index.md`).isFile()) {
      const doc = fs.readFileSync(`${currentFile}/index.md`, 'utf-8');
      Object.assign(child, getFrontMatter(doc));
    }

    if (fs.statSync(currentFile).isDirectory()) {
      child.children = createTree(currentFile, child.children);
      return child.children;
    }
  });

  return parent;
};

const result = createTree(INITIALPATH, TREE);

fs.writeFileSync(MENUFILE, JSON.stringify(result, null, 2));
