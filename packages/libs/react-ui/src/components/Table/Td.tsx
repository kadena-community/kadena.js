import type { Sprinkles } from '@theme/sprinkles.css';
import { tdClass } from './Table.css';

import { sprinkles } from '@theme/sprinkles.css';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export interface ITdProps
  extends Pick<Sprinkles, 'width' | 'minWidth' | 'maxWidth'> {
  children?: React.ReactNode;
}

export const Td: FC<ITdProps> = ({ children, width, minWidth, maxWidth }) => {
  return (
    <td
      className={classNames(tdClass, sprinkles({ width, minWidth, maxWidth }))}
    >
      {children}
    </td>
  );
};
