import yaml from 'js-yaml';

const getFrontMatter = (node) => {
  const { type, value } = node;

  if (type === 'yaml') {
    return yaml.load(value);
  }
};

const remarkFrontmatterToProps = () => {
  return async (tree) => {
    tree.children = tree.children.map((node) => {
      const data = getFrontMatter(node);
      if (!data) return node;

      return {
        type: 'props',
        data: {
          frontmatter: data,
        },
      };
    });
  };
};

export { remarkFrontmatterToProps as default };
