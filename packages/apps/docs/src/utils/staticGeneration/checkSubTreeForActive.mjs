import { getData } from './getData.mjs';
import path from 'path';

const omit = (obj, keysToOmit) =>
  Object.keys(obj)
    .filter((key) => !keysToOmit.includes(key))
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});

const isIndex = (filename) => {
  return filename === 'index';
};

// we dont want the last option in the path be "index"
const lastInPath = (filename) => {
  if (isIndex(filename)) return '';
  return `${filename}`;
};

export const getPathName = (filename) => {
  const endPoint = 'pages';

  const dirArray = filename.split('/');

  const newPath = dirArray
    .reverse()
    .slice(1, dirArray.indexOf(endPoint))
    .reverse()
    .join('/');

  return `/${newPath}${lastInPath(path.parse(filename).name)}`;
};

const IsMenuOpen = (pathname, itemRoot) =>
  `${pathname}/`.startsWith(`${itemRoot}/`);

const isPathRoot = (pathname, itemRoot) => itemRoot === pathname;

const mapSubTree = (pathname, noChildren, isRoot) => (item) => {
  const newItem = omit(item, [
    'description',
    'subTitle',
    'layout',
    'navigation',
    'editLink',
    'order',
    'lastModifiedDate',
    'publishDate',
    'author',
    'wordCount',
    'readingTimeInMinutes',
  ]);

  if (IsMenuOpen(pathname, newItem.root)) {
    newItem.isMenuOpen = true;
  } else {
    newItem.isMenuOpen = false;
  }

  if (isPathRoot(pathname, newItem.root)) {
    newItem.isActive = true;
  } else {
    newItem.isActive = false;
  }

  // is the actual item active
  if (!newItem.children || noChildren) newItem.children = [];
  if (isRoot && !pathname.includes(newItem.root)) newItem.children = [];
  newItem.children = newItem.children.map(mapSubTree(pathname, noChildren));

  return newItem;
};

export const checkSubTreeForActive = (path, noChildren = false) => {
  const tree = getData();

  if (!path) {
    throw new Error('no path');
  }

  return tree.map(mapSubTree(path, noChildren, true));
};
