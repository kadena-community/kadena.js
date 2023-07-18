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

const getModifiedDate = async (file) => {
  const relativePath = file.replace(process.cwd(), 'packages/apps/docs');

  const res = await fetch(`https://api.github.com/repos/kadena-community/kadena.js/commits?path=${relativePath}`);

  if (res.ok) {
    const data = await res.json();
    return data[0].commit.committer.date;
  } else {
    const message = `An error occurred: ${response.status}`;
    throw new Error(message);
  };
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

const remarkFrontmatterToProps = () => {
  return async (tree, file) => {
    const treeChildren = await Promise.all(tree.children.map(async (node) => {
      const data = getFrontMatter(node);
      if (!data) return node;

      const lastModifiedDate = await getModifiedDate(getFileName(file));

      return {
        type: 'props',
        data: {
          frontmatter: {
            editLink:
              process.env.NEXT_PUBLIC_GIT_EDIT_ROOT +
              getFileNameInPackage(file),
            lastModifiedDate,
            navigation: createNavigation(file),
            ...data,
          },
        },
      };
    }));
    tree.children = treeChildren;
    return tree;
  };
};

export { remarkFrontmatterToProps as default };
