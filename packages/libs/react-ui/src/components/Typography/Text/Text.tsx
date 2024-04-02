import classNames from 'classnames';
import type { HTMLAttributes, ReactNode } from 'react';
import React from 'react';

import { colorVariants, transformVariants } from '../typography.css';
import { fontMap } from './constants';

export interface ITextProps {
  as?: 'p' | 'span' | 'code';
  children: string | ReactNode;
  className?: string;
  color?: keyof typeof colorVariants;
  bold?: boolean;
  size?: 'small' | 'smallest' | 'base';
  transform?: keyof typeof transformVariants;
  variant?: 'body' | 'code' | 'ui';
  ariaLabel?: HTMLAttributes<HTMLSpanElement>['aria-label'];
  id?: HTMLAttributes<HTMLSpanElement>['id'];
}

/**
 * Text component
 * @param as - HTML element to render defaults to "span"
 * @param children - Text content
 * @param className - Additional classes
 * @param color - Color variant defaults to "default"
 * @param size - Typography size defaults to "base"
 * @param bold - Add extra font weight
 * @param transform - Text transform variant defaults to "none"
 * @param variant - Typography variant defaults to "body"
 */

export const Text = ({
  as,
  children,
  className,
  color = 'default',
  size = 'base',
  transform = 'none',
  variant = 'ui',
  ariaLabel,
  bold,
  id,
}: ITextProps) => {
  const classList = classNames(
    fontMap[variant][size][bold ? 'bold' : 'regular'],
    colorVariants[color],
    transformVariants[transform],
    className,
  );

  // if no "as" has been set but the variant is code then use code element. Else default to a span element.
  const Element = as ? as : variant === 'code' ? 'code' : 'span';

  return (
    <Element className={classList} aria-label={ariaLabel} id={id}>
      {children}
    </Element>
  );
};
