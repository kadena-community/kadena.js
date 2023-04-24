import { StyledButton, StyledLink, StyledTreeList } from './styles';

import { IMenuItem } from '@/types/Layout';
import React, { FC, useEffect, useRef, useState } from 'react';

interface IProps {
  item: IMenuItem;
  menuOpen?: boolean;
  root?: boolean;
  level?: number;
}

export const MainTreeItem: FC<IProps> = ({ item, root, level = 1 }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(root ? true : false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const parentUl = ref.current.closest('ul');
    const ul = ref.current.querySelector('ul');

    const parentScrollHeight = parentUl?.scrollHeight ?? 0;
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
  }, [ref, menuOpen]);

  const nextLevel = (): number => {
    if (root) return level;
    return level + 1;
  };

  return (
    <>
      {root && (
        <>
          <li>
            <StyledLink level={level} href={item.root}>
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
            level={level}
            menuOpen={menuOpen}
          >
            {item.header}
          </StyledButton>

          <StyledTreeList menuOpen={menuOpen} level={nextLevel()}>
            {!root && (
              <li>
                <StyledLink level={level + 1} href={item.root}>
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
              <StyledLink level={level} href={item.root}>
                {item.label}
              </StyledLink>
            </li>
          )}
        </>
      )}
    </>
  );
};
