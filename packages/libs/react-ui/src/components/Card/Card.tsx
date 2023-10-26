import className from 'classnames';
import type { FC } from 'react';
import React from 'react';
<<<<<<< HEAD
import { container, disabledClass, fullWidthClass } from './Card.css';
=======
import {
  containerClass,
  disabledClass,
  fullWidthClass,
  stackClass,
} from './Card.css';
>>>>>>> 721956e75 (fixing modal)

export interface ICardProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
}

<<<<<<< HEAD
export const Card: FC<ICardProps> = ({ children, disabled, fullWidth }) => {
  const classList = className(container, {
=======
export const Card: FC<ICardProps> = ({
  children,
  fullWidth,
  stack,
  disabled,
}) => {
  const classList = className(containerClass, {
    [stackClass]: stack,
>>>>>>> 721956e75 (fixing modal)
    [fullWidthClass]: fullWidth,
    [disabledClass]: disabled,
  });

  return <div className={classList}>{children}</div>;
};
