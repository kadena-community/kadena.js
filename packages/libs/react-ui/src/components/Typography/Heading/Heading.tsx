import classNames from 'classnames';
import type { ComponentPropsWithRef, FC } from 'react';
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

// eslint-disable-next-line @kadena-dev/typedef-var
export const HEADING_ELEMENTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
export type HeadingElementType = (typeof HEADING_ELEMENTS)[number];

export interface IHeadingProps extends ComponentPropsWithRef<'h1'> {
  as?: HeadingElementType;
  variant?: HeadingElementType;
  color?: keyof typeof colorVariants;
  transform?: keyof typeof transformVariants;
  children: React.ReactNode;
}

function getHeadingClass(variant: HeadingElementType): string {
  switch (variant) {
    case 'h2':
      return typographyFontH2;
    case 'h3':
      return typographyFontH3;
    case 'h4':
      return typographyFontH4;
    case 'h5':
      return typographyFontH5;
    case 'h6':
      return typographyFontH6;
    case 'h1':
    default:
      return typographyFontH1;
  }
}

export const Heading: FC<IHeadingProps> = ({
  as = 'h1',
  variant = as,
  color = 'emphasize',
  transform = 'none',
  children,
  className,
  ...props
}) => {
  const classList = classNames(
    getHeadingClass(variant),
    colorVariants[color],
    transformVariants[transform],
    className,
  );
  // making sure that the variant is one of the allowed ones in case typescript is ignored or not used
  const Element = HEADING_ELEMENTS.includes(as) ? as : 'h1';
  return (
    <Element className={classList} {...props}>
      {children}
    </Element>
  );
};
