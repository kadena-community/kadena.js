import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import type { Sprinkles } from '../../styles/sprinkles.css';
import { sprinkles } from '../../styles/sprinkles.css';
import { thClass } from './Table.css';

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
