import { parse as parseAst } from 'acorn';
import { DocsRootContent, IPropsType, ITree, Plugin } from './types';

// find all the props objects in the tree
const getProps = (tree: ITree): IPropsType[] => {
  return tree.children.filter((branch) => {
    return branch.type === 'props';
  }) as IPropsType[];
};

// add a getStaticProps to every MD or MDX file
const renderer = (data: IPropsType[]) => {
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

const remarkPropsToStaticRender = (): Plugin => {
  return async (tree): Promise<void> => {
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
