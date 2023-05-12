import yaml from 'js-yaml';
import { parse as parseAst } from 'acorn';

const IsYamlFrontmatter = ({ type }) => type === 'yaml';

const getFrontMatter = ({ value }) => yaml.load(value);

const renderer = (data) => {
  return `
    export const getStaticProps = async () => {
      return { props: {frontmatter: ${JSON.stringify(data)}} }
    }
  `;
};

const rehypeFrontmatter = () => {
  return async (tree) => {
    tree.children = tree.children.map((node) => {
      if (!IsYamlFrontmatter(node)) return node;

      const renderedString = renderer(getFrontMatter(node));
      const { body } = parseAst(renderedString, {
        sourceType: 'module',
        ecmaVersion: 'latest',
      });

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
