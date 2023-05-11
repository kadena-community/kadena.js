import { IMenuItem } from '@/types/Layout';

export const checkSubTreeForActive = (tree: IMenuItem[], pathname: string) => {
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
