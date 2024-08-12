import cn from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { containerClass, disabledClass, fullWidthClass } from './Card.css';

export interface ICardProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Card: FC<ICardProps> = ({
  children,
  fullWidth,
  disabled,
  className,
}) => {
  const classList = cn(containerClass, className, {
    [fullWidthClass]: fullWidth,
    [disabledClass]: disabled,
  });

  return <div className={classList}>{children}</div>;
};
