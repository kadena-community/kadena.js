import { IMenuItem } from '../../types/Layout';

import { getData } from './../getData';

import path from 'path';

const isIndex = (filename: string): boolean => {
  return filename === 'index';
};

// we dont want the last option in the path be "index"
const lastInPath = (filename: string): string => {
  if (isIndex(filename)) return '';
  return `/${filename}`;
};

export const getPathName = (): string => {
  const endPoint = 'docs';

  const dirArray = __dirname.split('/');
  const newPath = dirArray
    .reverse()
    .slice(0, dirArray.indexOf(endPoint) + 1)
    .reverse()
    .join('/');

  return `/${newPath}${lastInPath(path.parse(__filename).name)}`;
};

const mapSubTree =
  (pathname: string): ((item: IMenuItem) => IMenuItem) =>
  (item: IMenuItem): IMenuItem => {
    const newItem = { ...item };
    // is the menu open?
    if (`${pathname}/`.startsWith(`${newItem.root}/`)) {
      newItem.isMenuOpen = true;
    } else {
      newItem.isMenuOpen = false;
    }

    if (newItem.root === pathname) {
      newItem.isActive = true;
    } else {
      newItem.isActive = false;
    }

    // is the actual item active
    if (newItem.children.length) {
      newItem.children = activateSubTree(newItem.children, pathname);
    }
    return newItem;
  };

export const checkSubTreeForActive = (): IMenuItem[] => {
  const tree: IMenuItem[] = getData();
  const path = getPathName();

  return tree.map(mapSubTree(path));
};
