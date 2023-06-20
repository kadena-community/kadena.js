import React, { FC } from 'react';
import styles from './button.module.css';

export interface IButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'as' | 'disabled'> {
  // as?: 'button' | 'a';
  // onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  children: React.ReactNode;
  disabled?: boolean;
  color?: string;
  type?: string;
}

export const Button: FC<IButtonProps> = ({
  // as = 'button',
  // onClick,
  href,
  children,
  color,
  type,
  disabled
}) => {
  // const ariaLabel = props['aria-label'] ?? props.title;
  return (
    <a
      href={href}
      target="_blank"
      className={`
        ${styles.button}
        ${type ? styles[`${type}`] : ''}
        ${color? styles[`${color}`] : ''}
        ${disabled ? 'disabled' : ''}
      `}
    >
      {children}
    </a>
  );
};
