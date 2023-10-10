import type { IMenuItem } from '@/Layout';
import { hasSameBasePath } from '@/utils/hasSameBasePath';
import { useRouter } from 'next/router';
import type { MouseEventHandler, RefObject } from 'react';
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
  treeRef: RefObject<HTMLUListElement>,
): IReturn => {
  const router = useRouter();
  const [oldPathname, setOldPathname] = useState<string>('');
  const [active, setActive] = useState<number>(1);

  const findParentUlButton = (elm?: Element): HTMLElement | null => {
    if (!elm) return null;

    let foundElm: HTMLElement | null = elm.parentElement;

    do {
      if (!foundElm) {
        break;
      }

      const foundButton: HTMLElement | null | undefined =
        foundElm.querySelector('button, a');
      if (foundButton) {
        foundElm = foundButton;
        break;
      }
      foundElm = foundElm.parentElement;
    } while (
      foundElm?.tagName.toLowerCase() !== 'button' ||
      foundElm?.tagName.toLowerCase() !== 'a'
    );

    return foundElm;
  };

  useEffect(() => {
    if (router.isReady && treeRef.current) {
      const elms = treeRef.current.querySelectorAll('[data-active="true"]');
      const lastElm = elms[elms.length - 1];

      const elm = findParentUlButton(lastElm);
      if (!elm) return;

      treeRef.current?.parentElement?.scroll({
        top: elm.offsetTop,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [router.isReady, treeRef]);

  useEffect(() => {
    setOldPathname(router.pathname);

    const matchingItem = menuItems.find((item) =>
      hasSameBasePath(item.root, router.pathname),
    );

    const hasSubMenu = matchingItem?.children?.length ?? 0;

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

    if (clickedItem.dataset.active !== 'true') {
      const tree = treeRef.current;
      setTimeout(() => {
        // scrollintoview will not work correctly in a element with overFlow:'scroll'
        const elm = findParentUlButton(clickedItem);
        if (!elm) return;
        tree?.parentElement?.scroll({
          top: elm.offsetTop,
          left: 0,
          behavior: 'smooth',
        });
      }, 250);
    }

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
