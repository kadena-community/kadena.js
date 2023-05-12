import { IMenuItem } from '@/types/Layout';
import { hasSameBasePath } from '@/utils';
import { useRouter } from 'next/router';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';

interface IReturn {
  clickSubMenu: MouseEventHandler<HTMLUListElement>;
  clickMenu: (e: React.MouseEvent<HTMLAnchorElement>, item: IMenuItem) => void;
  active: number;
  activeItem?: IMenuItem;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}

export const useSideMenu = (
  closeMenu: () => void,
  menuItems: IMenuItem[],
): IReturn => {
  const router = useRouter();
  const [oldPathname, setOldPathname] = useState<string>('');
  const [active, setActive] = useState<number>(1);
  const [activeItem, setActiveItem] = useState<IMenuItem>();

  useEffect(() => {
    setOldPathname(router.pathname);

    const matchingItem = menuItems.find((item) =>
      hasSameBasePath(item.root, router.pathname),
    );

    setActiveItem(matchingItem);
    const hasSubMenu = matchingItem?.children.length ?? 0;

    if (hasSubMenu) {
      setActive(1);
    } else {
      setActive(0);
    }

    router.events.on('routeChangeStart', (url) => {
      if (hasSameBasePath(url, oldPathname) && hasSubMenu) {
        setActive(1);
      } else {
        setActive(0);
      }
    });
  }, [setOldPathname, oldPathname, router.pathname, router.events, menuItems]);

  const clickMenu = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: IMenuItem,
  ): void => {
    setActiveItem(item);
    if (
      hasSameBasePath(router.pathname, item.root ?? '') &&
      item.children.length
    ) {
      e.preventDefault();
      setActive(1);
    } else {
      closeMenu();
    }
  };

  const clickSubMenu: MouseEventHandler<HTMLUListElement> = (e) => {
    const clickedItem = e.target as HTMLAnchorElement;
    if (clickedItem.tagName.toLowerCase() !== 'a') return;

    if (clickedItem.hasAttribute('href')) {
      closeMenu();
    }
  };

  return {
    clickSubMenu,
    clickMenu,
    active,
    setActive,
    activeItem,
  };
};
