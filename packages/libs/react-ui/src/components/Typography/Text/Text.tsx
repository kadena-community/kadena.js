import {
  colorVariant,
  elementVariant,
  fontVariant,
  sizeVariant,
  transformVariant,
} from '../typography.css';

import React, { FC } from 'react';

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
  as,
  variant,
  font,
  bold,
  size,
  color,
  transform,
  children,
}) => {
  // const className = c;

  switch (as) {
    case 'p':
      return <p className={className}>{children}</p>;
    case 'code':
      return <code className={className}>{children}</code>;
    case 'label':
      return <label className={className}>{children}</label>;
    case 'span':
    default:
      return <span className={className}>{children}</span>;
  }
};
