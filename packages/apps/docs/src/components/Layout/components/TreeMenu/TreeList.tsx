import {
  treeListClass,
  treeListLevelVariantClass,
  treeListRootVariantClass,
} from './styles.css';

import classnames from 'classnames';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  menuOpen?: boolean;
  level?: 'l1' | 'l2' | 'l3';
  root?: boolean;
}

export const TreeList: FC<IProps> = ({
  children,
  menuOpen = false,
  root = false,
  level = 'l1',
}) => {
  const classes = classnames(
    treeListClass,
    treeListLevelVariantClass[level],
    treeListRootVariantClass[root ? 'isRoot' : 'isNotRoot'],
  );

  return (
    <ul role="list" className={classes}>
      {children}
    </ul>
  );
};
