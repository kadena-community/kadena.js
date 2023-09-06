import { asideListClass, asideListInnerVariants } from './styles.css';

import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';

interface IProps {
  children: ReactNode;
  inner?: boolean;
  // eslint-disable-next-line @rushstack/no-new-null
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
