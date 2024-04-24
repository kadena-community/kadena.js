import classnames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import {
  levelItemVariantClass,
  treeItemButtonClass,
  treeItemPseudoMenuVariantClass,
  treeItemPseudoVariantClass,
} from './styles.css';

interface IProps {
  children: ReactNode;
  onClick: () => void;
  level?: 'l0' | 'l1' | 'l2' | 'l3';
  menuOpen?: boolean;
}

export const TreeButton: FC<IProps> = ({
  children,
  onClick,
  level = 'l1',
  menuOpen = false,
}) => {
  const classes = classnames(
    treeItemButtonClass,
    levelItemVariantClass[level],
    treeItemPseudoVariantClass[level],
    treeItemPseudoMenuVariantClass[`${level}-${menuOpen}`],
  );
  return (
    <button
      data-testid={`${level}-button`}
      className={classes}
      onClick={onClick}
      data-active={menuOpen}
    >
      {children}
    </button>
  );
};
