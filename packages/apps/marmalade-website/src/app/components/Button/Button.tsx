import styles from './button.module.css'

import React, { FC } from 'react'

export interface IButtonProps {
  href?: string;
  children: React.ReactNode;
  disabled?: boolean;
  color?: string;
  type?: string;
  className?: string;
}

export const Button: FC<IButtonProps> = ({
  href,
  children,
  color,
  type,
  disabled
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
