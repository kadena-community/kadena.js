import { getData } from './getData.js';
import path from 'path';

const isIndex = (filename) => {
  return filename === 'index';
};

// we dont want the last option in the path be "index"
const lastInPath = (filename) => {
  if (isIndex(filename)) return '';
  return `/${filename}`;
};

export const getPathName = (filename) => {
  const endPoint = 'docs';

  const dirArray = filename.split('/');

  const newPath = dirArray
    .reverse()
    .slice(1, dirArray.indexOf(endPoint) + 1)
    .reverse()
    .join('/');

  return `/${newPath}${lastInPath(path.parse(filename).name)}`;
};

const IsMenuOpen = (pathname, itemRoot) =>
  `${pathname}/`.startsWith(`${itemRoot}/`);

const isPathRoot = (pathname, itemRoot) => itemRoot === pathname;

const mapSubTree = (pathname) => (item) => {
  const newItem = { ...item };

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
  if (!newItem.children) newItem.children = [];
  newItem.children = newItem.children.map(mapSubTree(pathname));

  return newItem;
};

export const checkSubTreeForActive = (path) => {
  const tree = getData();

  if (!path) {
    throw new Error('no path');
  }
  return tree.map(mapSubTree(path));
};
