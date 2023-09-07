import { thClass } from './Table.css';

import type { Sprinkles } from '@theme/sprinkles.css';
import { sprinkles } from '@theme/sprinkles.css';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export interface IThProps extends Pick<Sprinkles, 'width'> {
  children?: React.ReactNode;
}

export const Th: FC<IThProps> = ({ children, width }) => {
  return (
    <th className={classNames(thClass, sprinkles({ width }))}>{children}</th>
  );
};
