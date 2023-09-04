import {
  levelItemVariantClass,
  treeItemButtonClass,
  treeItemPseudoMenuVariantClass,
  treeItemPseudoVariantClass,
} from './styles.css';

import classnames from 'classnames';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  onClick: () => void;
  level?: 'l1' | 'l2' | 'l3';
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
    <button className={classes} onClick={onClick} data-Active={menuOpen}>
      {children}
    </button>
  );
};
