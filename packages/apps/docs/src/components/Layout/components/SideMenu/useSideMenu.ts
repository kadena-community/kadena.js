import type { IMenuItem } from '@/Layout';
import { hasSameBasePath } from '@/utils/hasSameBasePath';
import { useRouter } from 'next/router';
import type { MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';

interface IReturn {
  clickSubMenu: MouseEventHandler<HTMLUListElement>;
  clickMenu: (e: React.MouseEvent<HTMLAnchorElement>, item: IMenuItem) => void;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}

export const useSideMenu = (
  closeMenu: () => void,
  menuItems: IMenuItem[],
): IReturn => {
  const router = useRouter();
  const [oldPathname, setOldPathname] = useState<string>('');
  const [active, setActive] = useState<number>(1);

  useEffect(() => {
    setOldPathname(router.pathname);

    const matchingItem = menuItems.find((item) =>
      hasSameBasePath(item.root, router.pathname),
    );

    const hasSubMenu = matchingItem?.children?.length ?? 0;

    console.log(111111, matchingItem);
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
    const hasChildren = item.children?.length ?? 0;
    if (hasSameBasePath(router.pathname, item.root ?? '') && hasChildren) {
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
  };
};
