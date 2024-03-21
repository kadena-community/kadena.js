import cn from 'classnames';
import type { HTMLAttributes, ReactNode } from 'react';
import React from 'react';

import {
  bodyBaseBold,
  bodyBaseRegular,
  bodySmallBold,
  bodySmallRegular,
  bodySmallestBold,
  bodySmallestRegular,
  monospaceBaseBold,
  monospaceBaseRegular,
  monospaceSmallBold,
  monospaceSmallRegular,
  monospaceSmallestBold,
  monospaceSmallestRegular,
  uiBaseBold,
  uiBaseRegular,
  uiSmallBold,
  uiSmallRegular,
  uiSmallestBold,
  uiSmallestRegular,
} from '../../../styles';
import { colorVariants, transformVariants } from '../typography.css';

export interface ITextProps
  extends HTMLAttributes<HTMLSpanElement | HTMLParagraphElement> {
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

const fontMap = {
  code: {
    smallest: {
      regular: monospaceSmallestRegular,
      bold: monospaceSmallestBold,
    },
    small: { regular: monospaceSmallRegular, bold: monospaceSmallBold },
    base: {
      regular: monospaceBaseRegular,
      bold: monospaceBaseBold,
    },
  },
  ui: {
    smallest: { regular: uiSmallestRegular, bold: uiSmallestBold },
    small: { regular: uiSmallRegular, bold: uiSmallBold },
    base: { regular: uiBaseRegular, bold: uiBaseBold },
  },
  body: {
    smallest: { regular: bodySmallestRegular, bold: bodySmallestBold },
    small: { regular: bodySmallRegular, bold: bodySmallBold },
    base: { regular: bodyBaseRegular, bold: bodyBaseBold },
  },
};

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
  const classList = cn(
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
