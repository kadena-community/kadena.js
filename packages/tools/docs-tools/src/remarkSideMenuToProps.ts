import { join } from 'path';
import type { IMenuItem, IPropsType, ITree, Plugin } from './types';
import { checkSubTreeForActive } from './utils/staticGeneration/checkSubTreeForActive';
import { getConfig, getData } from './utils/staticGeneration/getData';

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

const getHeaderItems = async () => {
  const { menu } = await getConfig();
  const tree = await getData();

  return menu.map((item: string) => {
    const found = tree.find((d) => d.root === `/${item}`);
    if (!found) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, ...result } = found;
    return result;
  });
};

const remarkSideMenuToProps = (): Plugin => {
  return async (tree: ITree, file) => {
    const items = await checkSubTreeForActive(getPath(file.history[0]));

    const itemsReduced = items.map((item: Partial<IMenuItem>) => {
      if (item?.isMenuOpen) return item;

      delete item.children;
      return item;
    });

    const headerItems = await getHeaderItems();

    tree.children.push({
      type: 'props',
      data: {
        headerItems,
        leftMenuTree: itemsReduced,
      },
    } as unknown as IPropsType);

    return tree;
  };
};

export { remarkSideMenuToProps as default };
