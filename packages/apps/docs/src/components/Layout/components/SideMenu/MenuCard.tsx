import {
  menuCardActiveVariant,
  menuCardAnimateL2RVariant,
  menuCardClass,
} from './menuCard.css';

import classNames from 'classnames';
import React, { FC, MouseEventHandler, ReactNode } from 'react';

export interface IMenuCardProps {
  children?: ReactNode;
  active: number;
  idx: number;
  onClick?: MouseEventHandler<HTMLUListElement>;
  cyTestId?: string;
}

export const MenuCard: FC<IMenuCardProps> = ({
  children,
  onClick,
  active,
  idx = 0,
  cyTestId,
}) => {
  const classes = classNames(
    menuCardClass,
    menuCardActiveVariant[active === idx ? 'true' : 'false'],
    menuCardAnimateL2RVariant[active !== idx || idx !== 0 ? 'false' : 'true'],
  );

  return (
    <section className={classes} data-cy={cyTestId} onClick={onClick}>
      {children}
    </section>
  );
};
