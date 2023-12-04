import classNames from 'classnames';
import type { ComponentPropsWithRef, FC } from 'react';
import React from 'react';
import {
  fontH1Bold,
  fontH1Regular,
  fontH2Bold,
  fontH2Regular,
  fontH3Bold,
  fontH3Regular,
  fontH4Bold,
  fontH4Regular,
  fontH5Bold,
  fontH5Regular,
  fontH6Bold,
  fontH6Regular,
} from '../../../styles';
import { colorVariants, transformVariants } from '../typography.css';

// eslint-disable-next-line @kadena-dev/typedef-var
export const HEADING_ELEMENTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
export type HeadingElementType = (typeof HEADING_ELEMENTS)[number];

export interface IHeadingProps extends ComponentPropsWithRef<'h1'> {
  as?: HeadingElementType;
  variant?: HeadingElementType;
  bold?: boolean;
  color?: keyof typeof colorVariants;
  transform?: keyof typeof transformVariants;
  children: React.ReactNode;
}

function getHeadingClass(variant: HeadingElementType, isBold: boolean): string {
  switch (variant) {
    case 'h2':
      return isBold ? fontH2Bold : fontH2Regular;
    case 'h3':
      return isBold ? fontH3Bold : fontH3Regular;
    case 'h4':
      return isBold ? fontH4Bold : fontH4Regular;
    case 'h5':
      return isBold ? fontH5Bold : fontH5Regular;
    case 'h6':
      return isBold ? fontH6Bold : fontH6Regular;
    case 'h1':
    default:
      return isBold ? fontH1Bold : fontH1Regular;
  }
}

export const Heading: FC<IHeadingProps> = ({
  as = 'h1',
  variant = as,
  color = 'emphasize',
  transform = 'none',
  bold = true,
  children,
  ...props
}) => {
  const classList = classNames(
    getHeadingClass(variant, bold),
    colorVariants[color],
    transformVariants[transform],
  );
  // making sure that the variant is one of the allowed ones in case typescript is ignored or not used
  const Element = HEADING_ELEMENTS.includes(as) ? as : 'h1';
  return (
    <Element className={classList} {...props}>
      {children}
    </Element>
  );
};
