import importedMenu from './../data/menu.json' assert { type: 'json' };

export const getData = () => {
  const regex = /__tests/;

  if (process.env.NEXT_PUBLIC_APP_DEV === 'test') {
    return importedMenu.filter((item) => regex.test(item.root))[0].children;
  }
  return importedMenu.filter((item) => {
    return !regex.test(item.root);
  });
};

const checkSubTreeForActive = (tree, pathname) => {
  return tree.map((item) => {
    // is the menu open?
    if (`${pathname}/`.startsWith(`${item.root}/`)) {
      item.isMenuOpen = true;
    } else {
      item.isMenuOpen = false;
    }

    console.log(pathname, item.root);
    if (item.root === pathname) {
      console.log('ACTIVE');
      item.isActive = true;
    } else {
      item.isActive = false;
    }

    // is the actual item active
    if (item.children.length) {
      item.children = checkSubTreeForActive(item.children, pathname);
    }
    return item;
  });
};

const getPath = (filename) => {
  const arr = filename.split('/');
  let complete = false;

  return (
    '/' +
    arr
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
      .join('/')
  );
};

const remarkSideMenuToProps = () => {
  return async (tree, file) => {
    const items = checkSubTreeForActive(getData(), getPath(file.history[0]));

    console.log(items);

    tree.children.push({
      type: 'props',
      data: {
        leftMenuTree: items,
      },
    });

    return tree;
  };
};

export { remarkSideMenuToProps as default };
