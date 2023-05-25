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
            lastModifiedDate: getModifiedDate(getFileName(file)),
          },
        },
      };
    });
  };
};

export { remarkFrontmatterToProps as default };
