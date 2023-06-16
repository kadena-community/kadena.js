import { parse as parseAst } from 'acorn';

// find all the props objects in the tree
const getProps = (tree) => {
  return tree.children.filter((branch) => {
    return branch.type === 'props';
  });
};

// add a getStaticProps to every MD or MDX file
const renderer = (data) => {
  if (!data) return;
  const newData = data.reduce((acc, val) => {
    return { ...acc, ...val.data };
  }, {});
  return `
    export const getStaticProps = async () => {
      return { props: ${JSON.stringify(newData)} }
    }
  `;
};

const remarkPropsToStaticRender = () => {
  return async (tree) => {
    const props = getProps(tree);

    const renderedString = renderer(props);
    const { body } = parseAst(renderedString, {
      sourceType: 'module',
      ecmaVersion: 'latest',
    });

    tree.children.push({
      type: 'mdxjsEsm',
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body,
        },
      },
    });
  };
};

export { remarkPropsToStaticRender as default };
