import yaml from 'js-yaml';
import fs from 'fs';
import { getReadTime } from './utils.mjs';
import { getPathName } from './../utils/staticGeneration/checkSubTreeForActive.mjs';
import { getData } from './../utils/staticGeneration/getData.mjs';
import { authorsToArticles } from './../data/relatedArticles.mjs';

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

/**
 * Adds blog articles by the same author
 */
function getRelatedArticles(file, data) {
  if (data.layout !== 'blog') {
    return {};
  }
  const author = data.author;
  if (!author) return;

  const root = `/${getFileNameInPackage(file)
    .split('/')
    .splice(3, file.length - 1)
    .join('/')
    .replace(/\.mdx?$/, '')}`;

  const relatedArticles = authorsToArticles[author].filter(
    (article) => article.root !== root,
  );

  return {
    related: relatedArticles.slice(0, 5),
  };
}

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
            ...getRelatedArticles(file, data),
          },
        },
      };
    });
  };
};

export { remarkFrontmatterToProps as default };
