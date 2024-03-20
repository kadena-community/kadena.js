import cn from 'classnames';
import type { ComponentPropsWithRef, FC } from 'react';
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
} from '../../../styles';
import { colorVariants, transformVariants } from '../typography.css';

// eslint-disable-next-line @kadena-dev/typedef-var
export const TEXT_ELEMENTS = ['p', 'span', 'code'] as const;
export type TextElementType = (typeof TEXT_ELEMENTS)[number];

type TextVariant = 'small' | 'smallest' | 'base';
function getFontClass(
  variant: TextVariant,
  isBold: boolean,
  type: TextElementType,
): string {
  if (type === 'code' && variant === 'smallest') {
    return isBold ? monospaceSmallestBold : monospaceSmallestRegular;
  }
  if (type === 'code' && variant === 'small') {
    return isBold ? monospaceSmallBold : monospaceSmallRegular;
  }

  if (type === 'code' && variant === 'base') {
    return isBold ? monospaceBaseBold : monospaceBaseRegular;
  }

  if (variant === 'smallest') {
    return isBold ? bodySmallestBold : bodySmallestRegular;
  }
  if (variant === 'small') {
    return isBold ? bodySmallBold : bodySmallRegular;
  }

  return isBold ? bodyBaseBold : bodyBaseRegular;
}

export interface ITextProps extends ComponentPropsWithRef<'p'> {
  as?: TextElementType;
  variant?: TextVariant;
  bold?: boolean;
  color?: keyof typeof colorVariants;
  transform?: keyof typeof transformVariants;
  children: React.ReactNode;
}

export const Text: FC<ITextProps> = ({
  as = 'span',
  variant = 'base',
  bold = false,
  color = 'default',
  transform = 'none',
  children,
  className,
  ...props
}) => {
  const classList = cn(
    getFontClass(variant, bold, as),
    colorVariants[color],
    transformVariants[transform],
    className,
  );

  // making sure that the variant is one of the allowed ones in case typescript is ignored or not used
  const Element = TEXT_ELEMENTS.includes(as) ? as : 'span';
  return (
    <Element className={classList} {...props}>
      {children}
    </Element>
  );
};
