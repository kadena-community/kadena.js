import { useMediumScreen } from '@/hooks/useMediumScreen';
import { hasSameBasePath } from '@/utils/hasSameBasePath';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

interface IUseHeaderReturn {
  listRef: React.RefObject<HTMLUListElement>;
  backgroundRef: React.RefObject<HTMLDivElement>;
  hasPath: boolean;
}

const getActiveItem = (
  list: HTMLUListElement,
  pathname: string,
  clickedElement?: HTMLAnchorElement,
): { item?: HTMLLIElement; idx?: number } => {
  let item = list.firstChild as HTMLLIElement;
  let idx;

  Array.from(list.children).some((innerItem, innerIdx) => {
    const anchor = innerItem.firstChild as HTMLAnchorElement;
    if (
      clickedElement === anchor ||
      (!clickedElement &&
        hasSameBasePath(pathname, anchor?.getAttribute('href') ?? ''))
    ) {
      item = innerItem as HTMLLIElement;
      idx = innerIdx;
    }
  });

  return { item, idx };
};

export const useHeaderAnimation = (): IUseHeaderReturn => {
  const hasMediumScreen = useMediumScreen();
  const listRef = useRef<HTMLUListElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<number>(0);
  const [hasPath, setHasPath] = useState<boolean>(false);
  const router = useRouter();

  const selectItem = useCallback(
    (
      active: number,
      pathname: string,
      clickedElement?: HTMLAnchorElement,
    ): void => {
      const list = listRef.current;
      const bg = backgroundRef.current;

      if (!list || !bg) return;
      const { item: activeItem, idx } = getActiveItem(
        list,
        pathname,
        clickedElement,
      );

      setHasPath(false);

      if (idx === undefined || !activeItem) return;
      setHasPath(true);
      //slow down the animation, when the distance between current and new Item is larger
      const newPosition =
        activeItem.offsetLeft + activeItem.offsetWidth / 2 - bg.offsetWidth / 2;

      bg.style.transform = `translateX(${newPosition}px)`;
      bg.style.transitionDuration = `${0.3 + 0.1 * Math.abs(active - idx)}s`;

      activeRef.current = idx;
    },
    [activeRef],
  );

  useEffect(() => {
    selectItem(activeRef.current, router.pathname);
  }, [activeRef, selectItem, router.pathname, hasMediumScreen]);

  useEffect(() => {
    const changeUrl = (url: string): void => {
      const elm = listRef.current?.querySelector(`[href="${url}"]`);
      if (!elm) return;
      selectItem(activeRef.current, router.pathname, elm as HTMLAnchorElement);
    };

    router.events.on('routeChangeStart', changeUrl);

    return () => router.events.off('routeChangeStart', changeUrl);
  }, [activeRef, router.events, router.pathname, selectItem]);

  useEffect(() => {
    const changeSize = (): void => {
      selectItem(activeRef.current, router.pathname);
    };

    window.addEventListener('resize', changeSize);

    return () => {
      window.removeEventListener('resize', changeSize);
    };
  }, [activeRef, router.pathname, selectItem]);

  return { hasPath: hasPath, listRef, backgroundRef };
};
