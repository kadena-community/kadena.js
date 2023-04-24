import { StyledButton, StyledLink, StyledTreeList } from './styles';

import { IMenuItem } from '@/types/Layout';
import React, { FC, useEffect, useRef, useState } from 'react';

type LevelType = 1 | 2 | 3;
interface IProps {
  item: IMenuItem;
  menuOpen?: boolean;
  root?: boolean;
  level?: LevelType;
}

export const MainTreeItem: FC<IProps> = ({ item, root = false, level = 1 }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(item.isMenuOpen ?? false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!item.isMenuOpen) {
      setMenuOpen(false);
    }
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
  }, [ref, menuOpen, setIsMounted, isMounted]);

  const nextLevel = (): LevelType => {
    if (root) return level;
    return (level + 1) as LevelType;
  };

  return (
    <>
      {root && (
        <>
          <li>
            <StyledLink
              level={`l${level}`}
              href={item.root}
              active={item.isActive}
            >
              {item.label}
            </StyledLink>
          </li>
          {item.children.map((v) => (
            <MainTreeItem key={v.root} level={nextLevel()} item={v} />
          ))}
        </>
      )}
      {!root && item.children.length > 0 ? (
        <li key={item.root} ref={ref}>
          <StyledButton
            onClick={() => setMenuOpen((v) => !v)}
            level={`l${level}`}
            menuOpen={menuOpen}
          >
            {item.menu}
          </StyledButton>

          <StyledTreeList menuOpen={menuOpen} level={`l${nextLevel()}`}>
            {!root && (
              <li>
                <StyledLink
                  level={`l${nextLevel()}`}
                  href={item.root}
                  active={item.isActive}
                >
                  {item.label}
                </StyledLink>
              </li>
            )}
            {item.children.map((v) => {
              return <MainTreeItem key={v.root} level={nextLevel()} item={v} />;
            })}
          </StyledTreeList>
        </li>
      ) : (
        <>
          {!root && (
            <li>
              <StyledLink
                level={`l${level}`}
                href={item.root}
                active={item.isActive}
              >
                {item.label}
              </StyledLink>
            </li>
          )}
        </>
      )}
    </>
  );
};
