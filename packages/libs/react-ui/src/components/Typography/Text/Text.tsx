import cn from 'classnames';
import type { HTMLAttributes, ReactNode } from 'react';
import React from 'react';

import {
  bodyBaseRegular,
  bodySmallRegular,
  bodySmallestRegular,
  monospaceBaseRegular,
  monospaceSmallRegular,
  monospaceSmallestRegular,
  uiBaseRegular,
  uiSmallRegular,
  uiSmallestRegular,
} from '../../../styles';
import { colorVariants, transformVariants } from '../typography.css';

export interface ITextProps extends HTMLAttributes<HTMLSpanElement> {
  as?: 'p' | 'span' | 'code';
  children: string | ReactNode;
  className?: string;
  color?: keyof typeof colorVariants;
  size?: 'small' | 'smallest' | 'base';
  transform?: keyof typeof transformVariants;
  variant?: 'body' | 'code' | 'ui';
  ariaLabel?: HTMLAttributes<HTMLSpanElement>['aria-label'];
  id?: HTMLAttributes<HTMLSpanElement>['id'];
}

const fontMap = {
  code: {
    smallest: monospaceSmallestRegular,
    small: monospaceSmallRegular,
    base: monospaceBaseRegular,
  },
  ui: {
    smallest: uiSmallestRegular,
    small: uiSmallRegular,
    base: uiBaseRegular,
  },
  body: {
    smallest: bodySmallestRegular,
    small: bodySmallRegular,
    base: bodyBaseRegular,
  },
};

/**
 * Text component
 * @param as - HTML element to render defaults to "span"
 * @param children - Text content
 * @param className - Additional classes
 * @param color - Color variant defaults to "default"
 * @param size - Typography size defaults to "base"
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
  variant = 'body',
  ariaLabel,
  id,
}: ITextProps) => {
  const classList = cn(
    fontMap[variant][size],
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
