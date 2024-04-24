import type { IMenuItem, LevelType } from '@kadena/docs-tools';
import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Item } from './Item';
import { TreeButton } from './TreeButton';
import { TreeList } from './TreeList';

interface IProps {
  item: IMenuItem;
  menuOpen?: boolean;
  root?: boolean;
  level?: LevelType;
  testId?: string;
}

export const MainTreeItem: FC<IProps> = ({ item, root = false, level = 0 }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(item.isMenuOpen ?? false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    setMenuOpen(item.isMenuOpen);
  }, [item.isMenuOpen]);

  useEffect(() => {
    if (!ref.current) return;

    const parentUl = ref.current.closest('ul');
    const ul = ref.current.querySelector('ul');

    const parentScrollHeight = isMounted ? parentUl?.scrollHeight ?? 0 : 0;
    const scrollHeight = ul?.scrollHeight ?? 0;

    if (!menuOpen) {
      ul?.style.setProperty('height', '0');
      parentUl?.style.setProperty(
        'height',
        `${parentScrollHeight - scrollHeight}px`,
      );
    } else {
      ul?.style.setProperty('height', `${scrollHeight}px`);
      parentUl?.style.setProperty(
        'height',
        `${parentScrollHeight + scrollHeight}px`,
      );
    }

    setIsMounted(true);
  }, [ref, menuOpen, setIsMounted, isMounted, item]);

  const nextLevel = (): LevelType => {
    if (root) return level;
    return (level + 1) as LevelType;
  };

  const hasSubmenu = (item.children?.length ?? 0) > 0;

  return (
    <>
      {root && (
        <>
          <Item item={item} level={level} />
          {item.children?.map((v) => (
            <MainTreeItem key={v.root} level={nextLevel()} item={v} />
          ))}
        </>
      )}
      {!root && hasSubmenu ? (
        <li data-testid={`l${level}-item`} key={item.root} ref={ref}>
          <TreeButton
            onClick={() => setMenuOpen((v) => !v)}
            level={`l${level}`}
            menuOpen={menuOpen}
          >
            {item.menu}
          </TreeButton>

          <TreeList menuOpen={menuOpen} level={`l${nextLevel()}`}>
            {!root && <Item item={item} level={nextLevel()} />}
            {item.children?.map((v) => {
              return <MainTreeItem key={v.root} level={nextLevel()} item={v} />;
            })}
          </TreeList>
        </li>
      ) : (
        <>{!root && <Item item={item} level={level} />}</>
      )}
    </>
  );
};
