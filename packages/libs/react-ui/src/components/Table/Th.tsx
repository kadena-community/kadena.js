import { thClass } from './Table.css';

import type { Sprinkles } from '@theme';
import { sprinkles } from '@theme';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export interface IThProps
  extends Pick<Sprinkles, 'width' | 'minWidth' | 'maxWidth'> {
  children?: React.ReactNode;
}

export const Th: FC<IThProps> = ({ children, width, minWidth, maxWidth }) => {
  return (
    <th
      className={classNames(thClass, sprinkles({ width, minWidth, maxWidth }))}
    >
      {children}
    </th>
  );
};
