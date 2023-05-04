import yaml from 'js-yaml';
import { parse as parseAst } from 'acorn';

const getFrontMatter = (node) => {
  const { type, value } = node;

  if (type === 'yaml') {
    return yaml.load(value);
  }
};

const renderer = (data) => {
  return `
    export const getStaticProps = async () => {
      return { props: {frontmatter: ${JSON.stringify(data)}} }
    }
  `;
};

const rehypeFrontmatter = () => {
  return async (tree, file) => {
    tree.children = tree.children.map((node) => {
      const data = getFrontMatter(node);
      if (!data) return node;

      const renderedString = renderer(data, node);
      const { body } = parseAst(renderedString, { sourceType: 'module' });

      return {
        type: 'mdxjsEsm',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body,
          },
        },
      };
    });
  };
};

export { rehypeFrontmatter as default };
