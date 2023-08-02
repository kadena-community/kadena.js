import {
  colorVariants,
  fontVariants,
  transformVariants,
} from '../typography.css';

import { elementVariants, heading } from './Heading.css';

import React, { FC } from 'react';

export interface IHeadingProps {
  as?: keyof typeof elementVariants;
  variant?: keyof typeof elementVariants;
  font?: keyof typeof fontVariants;
  bold?: boolean;
  color?: keyof typeof colorVariants;
  transform?: keyof typeof transformVariants;
  children: React.ReactNode;
}

export const Heading: FC<IHeadingProps> = ({
  as = 'h1',
  variant = as,
  font = 'main',
  bold = true,
  color = 'emphasize',
  transform = 'none',
  children,
}) => {
  const classList = heading({
    variant,
    font,
    bold,
    color,
    transform,
  });

  switch (as) {
    case 'h2':
      return <h2 className={classList}>{children}</h2>;
    case 'h3':
      return <h3 className={classList}>{children}</h3>;
    case 'h4':
      return <h4 className={classList}>{children}</h4>;
    case 'h5':
      return <h5 className={classList}>{children}</h5>;
    case 'h6':
      return <h6 className={classList}>{children}</h6>;
    case 'h1':
    default:
      return <h1 className={classList}>{children}</h1>;
  }
};
