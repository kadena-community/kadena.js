import path from 'path';

import type { IMenuData, IMenuItem } from '../../types';
import { getData } from './getData';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const omit = (
  obj: Record<string, any>,
  keysToOmit: string[],
): Record<string, any> =>
  Object.keys(obj)
    .filter((key) => !keysToOmit.includes(key))
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});

const isIndex = (filename: string): boolean => {
  return filename === 'index';
};

// we dont want the last option in the path be "index"
const lastInPath = (filename: string): string => {
  if (isIndex(filename)) return '';
  return `${filename}`;
};

export const getPathName = (filename: string): string => {
  const endPoint = 'pages';

  const dirArray = filename.split('/');

  const newPath = dirArray
    .reverse()
    .slice(1, dirArray.indexOf(endPoint))
    .reverse()
    .join('/');

  const lastPath = lastInPath(path.parse(filename).name);
  if (newPath) return `/${newPath}/${lastPath}`;

  return `/${lastPath}`;
};

const IsMenuOpen = (pathname: string, itemRoot: string): boolean =>
  `${pathname}/`.startsWith(`${itemRoot}/`);

const isPathRoot = (pathname: string, itemRoot: string): boolean =>
  itemRoot === pathname;

type MapSubTreeReturnType = (item: IMenuData | IMenuItem) => IMenuItem;

const mapSubTree =
  (
    pathname: string,
    noChildren: boolean,
    isRoot = false,
  ): MapSubTreeReturnType =>
  (item: IMenuData | IMenuItem): IMenuItem => {
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
    ]) as unknown as IMenuItem;

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

export const checkSubTreeForActive = async (
  path: string,
  noChildren = false,
): Promise<IMenuItem[]> => {
  const tree = await getData();

  if (!path) {
    throw new Error('no path');
  }

  const newTree = tree.filter((item) => !item.root.includes('blogchain'));
  return newTree.map(mapSubTree(path, noChildren, true));
};
