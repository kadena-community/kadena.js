import yaml from 'js-yaml';
import fs from 'fs';

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

const remarkFrontmatterToProps = () => {
  return async (tree, file) => {
    tree.children = tree.children.map((node) => {
      const data = getFrontMatter(node);
      if (!data) return node;

      return {
        type: 'props',
        data: {
          frontmatter: {
            ...data,
            editLink:
              process.env.NEXT_PUBLIC_GIT_EDIT_ROOT +
              getFileNameInPackage(file),
            lastModifiedDate: getModifiedDate(getFileName(file)),
          },
        },
      };
    });
  };
};

export { remarkFrontmatterToProps as default };
