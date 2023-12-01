import { menuData } from '@/constants/side-menu-items';

export const getHref = (pathname: string, itemHref?: string): string => {
  if (!itemHref) return '#';
  const basePath = pathname.split('/')[1];

  if (!basePath) {
    const currentItem = menuData.find((item) => item.href === itemHref);
    return currentItem?.items ? currentItem.items[0].href : '#';
  }

  const itemFromMenu = menuData.find((item) => item.href === itemHref);

  if (!itemFromMenu) return '#';

  const activeHref = itemFromMenu.items?.find((item) => item.href === pathname);
  if (!activeHref) return itemFromMenu.items ? itemFromMenu.items[0].href : '#';

  return activeHref.href;
};
