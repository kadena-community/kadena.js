import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';

interface IUseHeaderReturn {
  handleSelectItem: (e: MouseEvent<HTMLUListElement>) => void;
  listRef: React.RefObject<HTMLUListElement>;
  backgroundRef: React.RefObject<HTMLDivElement>;
  active: number;
}

const getActiveItem = (
  list: HTMLUListElement,
  clickedElement?: HTMLLIElement,
): { item?: HTMLLIElement; idx: number } => {
  let item = list.firstChild as HTMLLIElement;
  let idx = 0;

  Array.from(list.children).forEach((innerItem, innerIdx) => {
    if (
      (!clickedElement && innerItem.getAttribute('data-active') === 'true') ||
      clickedElement === innerItem
    ) {
      item = innerItem as HTMLLIElement;
      idx = innerIdx;
    }
  });

  return { item, idx };
};

export const useHeaderAnimation = (): IUseHeaderReturn => {
  const listRef = useRef<HTMLUListElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>(1);

  const selectItem = useCallback(
    (active: number, clickedElement?: HTMLLIElement): void => {
      const list = listRef.current;
      const bg = backgroundRef.current;
      if (!list || !bg) return;

      const { item: activeItem, idx } = getActiveItem(list, clickedElement);

      const activeBox = activeItem?.getBoundingClientRect();
      const bgBox = bg?.getBoundingClientRect();

      if (bgBox === undefined || activeBox === undefined) return;

      //slow down the animation, when the distance between current and new Item is larger
      const newPosition = activeBox.x + activeBox.width / 2 - bgBox.width / 2;
      bg.style.transform = `translateX(${newPosition}px)`;
      bg.style.transitionDuration = `${0.3 + 0.1 * Math.abs(active - idx)}s`;

      setActive(idx);
    },
    [],
  );

  useEffect(() => {
    selectItem(active);
  }, [listRef, backgroundRef, active, selectItem]);

  const handleSelectItem = (e: MouseEvent<HTMLUListElement>): void => {
    const clickedElement = (e.target as HTMLElement)
      .parentElement as HTMLLIElement;

    selectItem(active, clickedElement);
  };

  return { handleSelectItem, listRef, backgroundRef, active };
};
