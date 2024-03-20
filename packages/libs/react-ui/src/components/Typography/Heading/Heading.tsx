import classNames from 'classnames';
import type { ReactNode } from 'react';
import React from 'react';
import {
  typographyFontH1,
  typographyFontH2,
  typographyFontH3,
  typographyFontH4,
  typographyFontH5,
  typographyFontH6,
} from '../../../styles';
import { colorVariants, transformVariants } from '../typography.css';

type HeadingElementType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface IHeadingProps {
  as?: HeadingElementType;
  children: ReactNode;
  className?: string;
  color?: keyof typeof colorVariants;
  transform?: keyof typeof transformVariants;
  variant?: HeadingElementType;
}

const fontMap = {
  h1: typographyFontH1,
  h2: typographyFontH2,
  h3: typographyFontH3,
  h4: typographyFontH4,
  h5: typographyFontH5,
  h6: typographyFontH6,
};

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
  color = 'default',
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
