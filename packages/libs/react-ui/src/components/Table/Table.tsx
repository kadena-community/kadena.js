import { tableClass } from './Table.css';
import { TBody } from './TBody';
import { THead } from './THead';
import type { CompoundType } from './types';
import type { Sprinkles } from '@theme/sprinkles.css';
import { sprinkles } from '@theme/sprinkles.css';

import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export interface ITableProps extends Pick<Sprinkles, 'wordBreak'> {
  children?: CompoundType<typeof TBody> | CompoundType<typeof THead>;
  striped?: boolean;
}

export const Table: FC<ITableProps> = ({ children, striped, wordBreak }) => {
  return (
    <table
      className={classNames(
        tableClass,
        { stripedClass: striped },
        sprinkles({ wordBreak }),
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
