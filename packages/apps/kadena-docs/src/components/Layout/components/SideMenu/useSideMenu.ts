import { useMediumScreen } from '@/hooks';
import { hasSameBasePath } from '@/utils';
import { useRouter } from 'next/router';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';

interface IReturn {
  clickSubMenu: MouseEventHandler<HTMLUListElement>;
  clickMenu: MouseEventHandler<HTMLUListElement>;
  menuRef: React.RefObject<HTMLDivElement>;
  subMenuRef: React.RefObject<HTMLDivElement>;
  hasMediumScreen: boolean;
  active: number;
  activeTitle: string;
  hasSubmenu: boolean;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}

export const useSideMenu = (closeMenu: () => void): IReturn => {
  const router = useRouter();
  const [oldPathname, setOldPathname] = useState<string>('');
  const [active, setActive] = useState<number>(1);
  const [activeTitle, setActiveTitle] = useState<string>('');
  const [hasSubmenu, setHasSubmenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);

  const hasMediumScreen = useMediumScreen();

  useEffect(() => {
    setOldPathname(router.pathname);
    let innerHasSubmenu = false;
    const menuLinks = Array.from(menuRef.current?.querySelectorAll('a') ?? []);
    const foundMenuItem = menuLinks.find((item) => {
      return hasSameBasePath(router.pathname, item.getAttribute('href') ?? '');
    });

    if (!foundMenuItem) {
      innerHasSubmenu = false;
    } else if (foundMenuItem.getAttribute('data-hassubmenu') === 'true') {
      innerHasSubmenu = true;
    }

    if (innerHasSubmenu) {
      setActive(1);
      setHasSubmenu(true);
      setActiveTitle(foundMenuItem?.innerText ?? '');
    } else {
      setActive(0);
      setHasSubmenu(false);
    }

    router.events.on('routeChangeStart', (url) => {
      if (hasSameBasePath(url, oldPathname) && innerHasSubmenu) {
        setActive(1);
      } else {
        setActive(0);
      }
    });
  }, [
    hasMediumScreen,
    setOldPathname,
    oldPathname,
    router.pathname,
    router.events,
    hasSubmenu,
  ]);

  const clickMenu: MouseEventHandler<HTMLUListElement> = (e) => {
    e.preventDefault();
    const clickedItem = e.target as HTMLAnchorElement;

    //check if the CURRENT pathname has a submenu.
    if (
      hasSameBasePath(
        router.pathname,
        clickedItem.getAttribute('href') ?? '',
      ) &&
      clickedItem.getAttribute('data-hassubmenu') === 'true'
    ) {
      setActiveTitle(clickedItem.innerText);
      setActive(1);
      setHasSubmenu(true);
    } else {
      closeMenu();
      setHasSubmenu(false);
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
    menuRef,
    subMenuRef,
    hasMediumScreen,
    active,
    activeTitle,
    hasSubmenu,
    setActive,
  };
};
