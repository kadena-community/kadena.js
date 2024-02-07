import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import type { Sprinkles } from '../../styles/sprinkles.css';
import { sprinkles } from '../../styles/sprinkles.css';
import { thClass } from './Table.css';

export interface IThProps
  extends Pick<Sprinkles, 'width' | 'minWidth' | 'maxWidth'> {
  children?: React.ReactNode;
  className?: string;
}

export const Th: FC<IThProps> = ({
  children,
  width,
  minWidth,
  maxWidth,
  className,
}) => {
  return (
    <th
      className={classNames(
        thClass,
        sprinkles({ width, minWidth, maxWidth }),
        className,
      )}
    >
      {children}
    </th>
  );
};
