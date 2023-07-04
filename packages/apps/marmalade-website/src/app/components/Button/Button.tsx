import styles from './button.module.css'

import React, { FC } from 'react'

export interface IButtonProps {
  href?: string;
  color?: string;
  type?: string;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button: FC<IButtonProps> = ({
  href,
  color,
  type,
  disabled,
  children,
  onClick,
  ...props
}) => {

  const colorVariant = color? styles[`${color}`] : '';
  const typeVariant = type ? styles[`${type}`] : '';

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`
          button
          ${styles.button}
          ${typeVariant}
          ${colorVariant}
          ${disabled ?? ''}
        `}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      {...props}
      onClick={onClick}
      className={`
        button
        ${styles.button}
        ${typeVariant}
        ${colorVariant}
        ${disabled ?? ''}
      `}
    >
      {children}
    </button>
  );
};
