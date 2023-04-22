import { styled, Text } from '@kadena/react-components';

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
  const ref = useRef<HTMLUListElement>();

  //   useEffect(() => {
  //     if (!ref.current) return;
  //     if (!menuOpen) {
  //       ref.current.style.height = '0';
  //     } else {
  //       ref.current.closest('ul')?.setAttribute('style', { height: 'auto' });

  //       console.log(
  //         ref.current.scrollHeight + ref.current.closest('ul').scrollHeight,
  //       );
  //       ref.current.style.height = `${
  //         ref.current.scrollHeight + ref.current.closest('ul').scrollHeight
  //       }px`;
  //     }
  //   }, [ref, menuOpen]);

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
        <li key={item.root}>
          {root && (
            <StyledLink level={level} href={item.root}>
              {item.label}
            </StyledLink>
          )}
          {!root && (
            <StyledButton
              onClick={() => setMenuOpen((v) => !v)}
              level={level}
              menuOpen={menuOpen}
            >
              {item.header}
            </StyledButton>
          )}
          <StyledTreeList ref={ref} menuOpen={menuOpen}>
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
