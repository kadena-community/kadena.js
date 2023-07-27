import yaml from 'js-yaml';
import fs from 'fs';
import { getPathName } from './../utils/staticGeneration/checkSubTreeForActive.mjs';
import { getData } from './../utils/staticGeneration/getData.mjs';

const getFrontMatter = (node) => {
  const { type, value } = node;

  if (type === 'yaml') {
    return yaml.load(value);
  }
};

const getModifiedDate = (file) => {
  const stats = fs.statSync(file);
  if (!stats.isFile() || !stats.mtimeMs) return;

  const date = new Date(stats.mtimeMs);
  return date.toISOString();
};

const getFileName = (file) => {
  if (file.history.length === 0) return '';
  return file.history[0];
};

const getFileNameInPackage = (file) => {
  const filename = getFileName(file);
  if (!filename) return '';
  const endPoint = 'packages';

  const dirArray = filename.split('/');

  const newPath = dirArray
    .reverse()
    .slice(0, dirArray.indexOf(endPoint) + 1)
    .reverse()
    .join('/');

  return `/${newPath}`;
};

const flat = (acc, val) => {
  const { children, ...newVal } = val;

  return [
    ...acc,
    newVal,
    children ? children.reduce(flat, []).flat() : undefined,
  ];
};
/**
 * create a navigation object with the next and previous link in the navigation json.
 */
const createNavigation = (file) => {
  const path = getPathName(getFileName(file));
  const flatData = getData().reduce(flat, []).flat();

  const itemIdx = flatData.findIndex((i) => i.root === path);

  return {
    previous: flatData[itemIdx - 1] ?? undefined,
    next: flatData[itemIdx + 1] ?? undefined,
  };
};

const getReadTime = (content) => {
  const WORDS_PER_MINUTE = 200;
  let result = {};
  //Matches words
  //See
  //https://regex101.com/r/q2Kqjg/6
  const regex = /\w+/g;
  result.wordCount = (content || '').match(regex).length;
  result.readingTimeInMinutes = Math.ceil(result.wordCount / WORDS_PER_MINUTE);

  return result;
};

const remarkFrontmatterToProps = () => {
  return async (tree, file) => {
    tree.children = tree.children.map((node) => {
      const data = getFrontMatter(node);

      if (!data) return node;

      return {
        type: 'props',
        data: {
          frontmatter: {
            ...getReadTime(file.value),
            editLink:
              process.env.NEXT_PUBLIC_GIT_EDIT_ROOT +
              getFileNameInPackage(file),
            lastModifiedDate: getModifiedDate(getFileName(file)),
            navigation: createNavigation(file),
            ...data,
          },
        },
      };
    });
  };
};

export { remarkFrontmatterToProps as default };
