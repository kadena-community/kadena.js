import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import type { Sprinkles } from '../../styles/sprinkles.css';
import { sprinkles } from '../../styles/sprinkles.css';
import { TBody } from './TBody';
import { THead } from './THead';
import { tableClass } from './Table.css';
import type { CompoundType } from './types';

export interface ITableProps extends Pick<Sprinkles, 'wordBreak'> {
  children?: CompoundType<typeof TBody> | CompoundType<typeof THead>;
  striped?: boolean;
  className?: string;
}

export const Table: FC<ITableProps> = ({
  children,
  striped,
  wordBreak,
  className,
}) => {
  return (
    <table
      className={classNames(
        tableClass,
        { stripedClass: striped },
        sprinkles({ wordBreak }),
        className,
      )}
    >
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== TBody && child.type !== THead)
        )
          return null;

        return child;
      })}
    </table>
  );
};
