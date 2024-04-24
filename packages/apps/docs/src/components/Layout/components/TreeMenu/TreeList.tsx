import classnames from 'classnames';
import type { ReactNode } from 'react';
import React, { forwardRef } from 'react';
import {
  treeListClass,
  treeListLevelVariantClass,
  treeListRootVariantClass,
} from './styles.css';

interface IProps {
  children: ReactNode;
  menuOpen?: boolean;
  level?: 'l0' | 'l1' | 'l2' | 'l3';
  root?: boolean;
}

export const TreeList = forwardRef<HTMLUListElement, IProps>(
  ({ children, menuOpen = false, root = false, level = 'l1' }, ref) => {
    const classes = classnames(
      treeListClass,
      treeListLevelVariantClass[level],
      treeListRootVariantClass[root ? 'isRoot' : 'isNotRoot'],
    );

    return (
      <ul ref={ref} role="list" className={classes}>
        {children}
      </ul>
    );
  },
);

TreeList.displayName = 'TreeList';
