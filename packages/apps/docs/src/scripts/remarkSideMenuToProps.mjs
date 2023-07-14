import { checkSubTreeForActive } from './../utils/staticGeneration/checkSubTreeForActive.mjs';

const getPath = (filename) => {
  const arr = filename.split('/');
  let complete = false;

  return `/${arr
    .reverse()
    .reduce((acc, val) => {
      const fileName = val.split('.')[0];
      if (fileName.includes('index') || complete) return acc;
      if (fileName === 'docs') {
        complete = true;
      }
      acc.push(fileName);
      return acc;
    }, [])
    .reverse()
    .join('/')}`;
};

const remarkSideMenuToProps = () => {
  return async (tree, file) => {
    const items = checkSubTreeForActive(getPath(file.history[0]));

    const itemsReduced = items.map((item) => {
      if (item.isMenuOpen) return item;

      delete item.children;
      return item;
    });

    tree.children.push({
      type: 'props',
      data: {
        leftMenuTree: itemsReduced,
      },
    });

    return tree;
  };
};

export { remarkSideMenuToProps as default };
