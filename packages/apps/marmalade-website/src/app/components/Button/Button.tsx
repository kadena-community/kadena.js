import styles from './button.module.css'

import React, { FC } from 'react'

export interface IButtonProps {
  href?: string;
  color?: string;
  type?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button: FC<IButtonProps> = ({
  href,
  color,
  type,
  disabled,
  children
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`
        button
        ${styles.button}
        ${type ? styles[`${type}`] : ''}
        ${color? styles[`${color}`] : ''}
        ${disabled ?? ''}
      `}
    >
      {children}
    </a>
  );
};
