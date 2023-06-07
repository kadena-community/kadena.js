import {
  baseText,
  colorVariant,
  elementVariant,
  fontVariant,
  transformVariant,
} from './typography.css';

import React, { FC } from 'react';

export interface ITextProps {
  as?: 'span' | 'p' | 'code' | 'label';
  variant?: keyof typeof elementVariant;
  font?: keyof typeof fontVariant;
  bold?: boolean;
  color?: keyof typeof colorVariant;
  transform?: keyof typeof transformVariant;
  children: React.ReactNode;
}

export const Text: FC<ITextProps> = ({
  as,
  variant,
  font,
  bold,
  color,
  transform,
  children,
}) => {
  return (
    <span
      className={baseText({
        variant: variant ?? as,
        font,
        bold,
        color,
        transform,
      })}
    >
      {children}
    </span>
  );
};
