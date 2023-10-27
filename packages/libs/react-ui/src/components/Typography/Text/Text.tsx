import cn from 'classnames';
import type { FC } from 'react';
import React from 'react';
import {
  boldClass,
  colorVariant,
  elementVariant,
  fontVariant,
  sizeVariant,
  transformVariant,
} from './Text.css';

export interface ITextProps {
  as?: keyof typeof elementVariant;
  variant?: keyof typeof elementVariant;
  font?: keyof typeof fontVariant;
  bold?: boolean;
  color?: keyof typeof colorVariant;
  transform?: keyof typeof transformVariant;
  size?: keyof typeof sizeVariant;
  children: React.ReactNode;
}

export const Text: FC<ITextProps> = ({
  as = 'span',
  variant = as,
  font = variant === 'code' ? 'mono' : 'main',
  bold = false,
  size = 'lg',
  color = 'default',
  transform = 'none',
  children,
}) => {
  const classList = cn(
    elementVariant[variant],
    fontVariant[font],
    sizeVariant[size],
    colorVariant[color],
    transformVariant[transform],
    { [boldClass]: bold },
  );

  switch (as) {
    case 'p':
      return <p className={classList}>{children}</p>;
    case 'code':
      return <code className={classList}>{children}</code>;
    case 'span':
    default:
      return <span className={classList}>{children}</span>;
  }
};
