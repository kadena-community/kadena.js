import * as fs from 'fs';
import yaml from 'js-yaml';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
import { frontmatter } from 'micromark-extension-frontmatter';
import { IMenuData } from '../src/Layout';
import { ErrorsReturn, SucccessReturn } from './types.mjs';
import { getLastModifiedDate } from './utils/getLastModifiedDate.mjs';
import { getReadTime } from './utils/getReadTime.mjs';

const errors: ErrorsReturn = [];
const success: SucccessReturn = [];

const INITIALPATH = './src/pages';
const MENUFILEDIR = './src/_generated';
const MENUFILE = 'menu';
const TREE = [];

const isMarkDownFile = (name: string): boolean => {
  const arr = name.split('.');
  const extension = arr[arr.length - 1];
  return extension.toLowerCase() === 'md' || extension.toLowerCase() === 'mdx';
};

const isIndex = (file: string): boolean => {
  return file.includes('/index');
};

const convertFile = async (file: string): Promise<IMenuData | undefined> => {
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

const getFrontMatter = (doc: string, file: string): IMenuData | undefined => {
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

const minimumZeroValue = (value: number): number => {
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

const findPath = (dir: string): string | undefined => {
  const [, ...dirArray] = dir.split('/');
  let file = dirArray.pop()?.split('.') ?? [];
  let path = dirArray.splice(2, dir.length - 1).join('/');

  const fileName = file[0];
  if (fileName === 'index') return;
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
  let child: any = {
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

const createMJS = (result) => {
  // write menu file
  const fileStr = `
    /* eslint @kadena-dev/typedef-var: "off" */
    export const menuData = ${JSON.stringify(result, null, 2)}
  `;

  fs.mkdirSync(MENUFILEDIR, { recursive: true });
  fs.writeFileSync(`${MENUFILEDIR}/${MENUFILE}.mjs`, fileStr);
};

const createTJS = (result) => {
  // write menu file
  const fileStr = `
    import { IMenuData } from '@/Layout';

    export const menuData = ${JSON.stringify(result, null, 2)}
  `;

  fs.mkdirSync(MENUFILEDIR, { recursive: true });
  fs.writeFileSync(`${MENUFILEDIR}/${MENUFILE}.mts`, fileStr);
};

export const createDocsTree = async () => {
  const result = await createTree(INITIALPATH, TREE);

  createMJS(result);
  createTJS(result);

  success.push('Docs imported from monorepo');

  return { errors, success };
};
