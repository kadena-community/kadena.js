import type { IMenuItem, IPropsType, ITree, Plugin } from './types';
import { checkSubTreeForActive } from './utils/staticGeneration/checkSubTreeForActive';

const getPath = (filename: string): string => {
  const arr = filename.split('/');
  let complete = false;

  return `/${arr
    .reverse()
    .reduce((acc: string[], val: string) => {
      const fileName = val.split('.')[0];
      if (fileName.includes('index') || complete) return acc;
      if (fileName === 'pages') {
        complete = true;
      }
      //this will exclude pages dir
      if (!complete) {
        acc.push(fileName);
      }
      return acc;
    }, [])
    .reverse()
    .join('/')}`;
};

const remarkSideMenuToProps = (): Plugin => {
  return async (tree: ITree, file) => {
    console.log('path', getPath(file.history[0]));
    const items = await checkSubTreeForActive(getPath(file.history[0]));

    const itemsReduced = items.map((item: Partial<IMenuItem>) => {
      if (item?.isMenuOpen) return item;

      delete item.children;
      return item;
    });

    tree.children.push({
      type: 'props',
      data: {
        leftMenuTree: itemsReduced,
      },
    } as unknown as IPropsType);

    return tree;
  };
};

export { remarkSideMenuToProps as default };
