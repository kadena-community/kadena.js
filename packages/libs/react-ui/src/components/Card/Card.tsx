import { container, fullWidthClass, stackClass } from './Card.css';

import className from 'classnames';
import React, { FC } from 'react';

export interface ICardChildComponentProps {
  children: React.ReactNode;
}

export interface ICardProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  stack?: boolean;
}

export const Card: FC<ICardProps> = ({ children, fullWidth, stack }) => {
  const classList = className(container, {
    [fullWidthClass]: fullWidth,
    [stackClass]: stack,
  });

  return <div className={classList}>{children}</div>;
};
