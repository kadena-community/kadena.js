import { IMenuItem } from '@/types/Layout';
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

export const checkSubTreeForActive = (tree: IMenuItem[], pathname: string) => {
  return tree.map((item) => {
    // is the menu open?
    if (`${pathname}/`.startsWith(`${item.root}/`)) {
      item.isMenuOpen = true;
    } else {
      item.isMenuOpen = false;
    }

    console.log(pathname, item.root);
    if (item.root === pathname) {
      console.log('ACTIVE');
      item.isActive = true;
    } else {
      item.isActive = false;
    }

    // is the actual item active
    if (item.children.length) {
      item.children = checkSubTreeForActive(item.children, pathname);
    }
    return item;
  });
};
