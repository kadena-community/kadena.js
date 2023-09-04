import { asideListClass, asideListInnerVariants } from './styles.css';

import classNames from 'classnames';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  inner?: boolean;
  ref?: React.MutableRefObject<HTMLUListElement | null>;
}

export const AsideList: FC<IProps> = ({ children, inner = false, ref }) => {
  const classes = classNames(
    asideListClass,
    asideListInnerVariants[inner ? 'true' : 'false'],
  );
  return (
    <ul ref={ref} className={classes}>
      {children}
    </ul>
  );
};
