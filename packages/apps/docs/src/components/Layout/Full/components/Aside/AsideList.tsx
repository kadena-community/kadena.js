import classNames from 'classnames';
import type { ReactNode } from 'react';
import React from 'react';
import { asideListClass, asideListInnerVariants } from './styles.css';

interface IProps {
  children: ReactNode;
  inner?: boolean;
}

export const AsideList = React.forwardRef<HTMLUListElement, IProps>(
  ({ children, inner = false }, ref) => {
    const classes = classNames(
      asideListClass,
      asideListInnerVariants[inner ? 'true' : 'false'],
    );
    return (
      <ul ref={ref} className={classes}>
        {children}
      </ul>
    );
  },
);

AsideList.displayName = 'AsideList';
