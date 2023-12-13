import type { LayoutType } from '@kadena/docs-tools';
import { getReadTime } from '@kadena/docs-tools';
import { isValid } from 'date-fns';
import * as fs from 'fs';
import yaml from 'js-yaml';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
import { frontmatter } from 'micromark-extension-frontmatter';
import { promiseExec } from './build';
import { TEMP_DIR } from './importReadme/createDoc';

const errors: string[] = [];
const success: string[] = [];

const INITIAL_PATH = './src/pages';
const MENU_FILE_DIR = './src/_generated';
const MENU_FILE = 'menu.json';
const TREE: IParent[] = [];

const isMarkDownFile = (name: string): boolean => {
  const extension = name.split('.').at(-1);
  return (
    extension?.toLowerCase() === 'md' || extension?.toLowerCase() === 'mdx'
  );
};

export const getLastModifiedDate = async (
  root: string,
): Promise<string | undefined> => {
  const rootArray = root.split('/');
  const filename = rootArray.pop();
  const newRoot = rootArray.join('/');

  const { stdout } = await promiseExec(
    `cd ${TEMP_DIR} && cd ${newRoot} && git log -1 --pretty="format:%ci" ${filename}`,
  );

  const date = new Date(stdout);
  if (!isValid(date)) return;

  return date.toUTCString();
};

const isIndex = (file: string): boolean => {
  return file.includes('/index');
};

interface IConvertFileResult {
  lastModifiedDate: string | undefined;
  title: string;
  description: string;
  menu: string;
  label: string;
  order: number;
  layout: LayoutType;
  tags: string[];
  wordCount: number;
  readingTimeInMinutes: number;
  isMenuOpen: boolean;
  isActive: boolean;
  isIndex: boolean;
}

interface IParent extends IConvertFileResult {
  children: IParent[];
  root: string;
  subtitle: string;
}

const getFrontMatter = (doc: string, file: string): unknown => {
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

const convertFile = async (
  file: string,
): Promise<IConvertFileResult | undefined> => {
  const doc = fs.readFileSync(`${file}`, 'utf-8');
  let data;
  if (isMarkDownFile(file)) {
    data = getFrontMatter(doc, file);
  } else {
    const regex = /frontmatter\s*:\s*{[^}]+}/;
    const match = doc.match(regex);
    if (!match) return;

    const metaString = match[0]
      .replace(/frontmatter:/, '')
      .replace(/(\w+):/g, '"$1":')
      .replace(/'/g, '"')
      .replace(/,(\s*[}\]])/g, '$1');

    data = JSON.parse(metaString);
  }
  if (!data) return;

  const readTime = getReadTime(doc);
  const lastModifiedDate = data.lastModifiedDate
    ? data.lastModifiedDate
    : await getLastModifiedDate(
        `./kadena-community/kadena.js/packages/apps/docs/${file.substr(
          2,
          file.length - 1,
        )}`,
      );

  return {
    lastModifiedDate,
    ...data,
    ...readTime,
    isMenuOpen: false,
    isActive: false,
    isIndex: isIndex(file),
  };
};

const minimumZeroValue = (value: number): number => {
  return value <= 0 ? 0 : value;
};

const pushToParent = (parent: IParent[], child: IParent): IParent[] => {
  let added = false;
  if (!parent.length || !child.order) {
    added = true;
    parent.push(child as IParent);
    return parent;
  }

  parent.forEach((item, idx) => {
    if (
      parseInt(child?.order?.toString()) <= parseInt(item.order?.toString()) &&
      !added
    ) {
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
  const file = dirArray.pop();
  const path = dirArray.splice(2, dir.length - 1).join('/');

  const fileName = file?.split('.').at(0);
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

const createTree = async (
  rootDir: string,
  parent: IParent[] = [],
): Promise<IParent[]> => {
  const files = fs.readdirSync(rootDir);

  for (let i = 0; i < files.length; i++) {
    /* eslint-disable-next-line @typescript-eslint/no-use-before-define*/
    await getFile(rootDir, parent, files[i]);
  }

  return parent;
};

const getFile = async (
  rootDir: string,
  parent: IParent[],
  file: string,
): Promise<IParent[] | undefined> => {
  const currentFile = `${rootDir}/${file}`;
  const arr: IParent[] = [];
  const child: Partial<IParent> = {
    children: arr,
  };
  child.root = findPath(currentFile);

  if (!child.root) return;

  if (
    SEARCHABLE_DIRS.some((item) => {
      return currentFile.startsWith(`${INITIAL_PATH}${item}`);
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

    parent = pushToParent(parent, child as IParent);

    if (fs.statSync(currentFile).isDirectory()) {
      child.children = await createTree(currentFile, child.children);

      return child.children;
    }
  }
};

interface IDocsTreeResult {
  errors: string[];
  success: string[];
}

export const createDocsTree = async (): Promise<IDocsTreeResult> => {
  const result = await createTree(INITIAL_PATH, TREE);
  // write menu file
  const fileStr = `/* eslint @kadena-dev/typedef-var: "off" */
  export const menuData = ${JSON.stringify(result, null, 2)}`;

  fs.mkdirSync(MENU_FILE_DIR, { recursive: true });
  fs.writeFileSync(`${MENU_FILE_DIR}/${MENU_FILE}`, fileStr);

  success.push('Docs imported from monorepo');

  return { errors, success };
};
