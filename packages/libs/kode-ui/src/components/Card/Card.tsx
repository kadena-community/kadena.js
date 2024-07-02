import className from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { containerClass, disabledClass, fullWidthClass } from './Card.css';

export interface ICardProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Card: FC<ICardProps> = ({ children, fullWidth, disabled }) => {
  const classList = className(containerClass, {
    [fullWidthClass]: fullWidth,
    [disabledClass]: disabled,
  });

  return <div className={classList}>{children}</div>;
};
