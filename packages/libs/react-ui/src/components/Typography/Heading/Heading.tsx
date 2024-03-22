import classNames from 'classnames';
import type { ReactNode } from 'react';
import React from 'react';

import { colorVariants, transformVariants } from '../typography.css';
import { fontMap } from './contants';

type HeadingElementType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface IHeadingProps {
  as?: HeadingElementType;
  children: ReactNode;
  className?: string;
  color?: keyof typeof colorVariants;
  transform?: keyof typeof transformVariants;
  variant?: HeadingElementType;
}
/**
 * Heading component
 * @param as - HTML element to render defaults to "h1"
 * @param children - Text content
 * @param className - Additional classes
 * @param color - Color variant defaults to "default"
 * @param transform - Text transform variant defaults to "none"
 * @param variant - Typography variant defaults to the "as" param
 */

export const Heading = ({
  as = 'h2',
  children,
  className,
  color = 'emphasize',
  transform = 'none',
  variant = as,
}: IHeadingProps) => {
  const classList = classNames(
    fontMap[variant],
    colorVariants[color],
    transformVariants[transform],
    className,
  );

  const Element = as;

  return <Element className={classList}>{children}</Element>;
};
