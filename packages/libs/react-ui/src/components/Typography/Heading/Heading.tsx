import type { ComponentPropsWithRef, FC } from 'react';
import React from 'react';
import type {
  colorVariants,
  fontVariants,
  transformVariants,
} from '../typography.css';
import type { elementVariants } from './Heading.css';
import { heading } from './Heading.css';

export interface IHeadingProps extends ComponentPropsWithRef<'h1'> {
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
  ...props
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
      return (
        <h2 className={classList} {...props}>
          {children}
        </h2>
      );
    case 'h3':
      return (
        <h3 className={classList} {...props}>
          {children}
        </h3>
      );
    case 'h4':
      return (
        <h4 className={classList} {...props}>
          {children}
        </h4>
      );
    case 'h5':
      return (
        <h5 className={classList} {...props}>
          {children}
        </h5>
      );
    case 'h6':
      return (
        <h6 className={classList} {...props}>
          {children}
        </h6>
      );
    case 'h1':
    default:
      return (
        <h1 className={classList} {...props}>
          {children}
        </h1>
      );
  }
};
