import cn from 'classnames';
import type { FC } from 'react';
import React from 'react';
import {
  bodyBaseBold,
  bodyBaseRegular,
  bodySmallBold,
  bodySmallRegular,
  codeBaseBold,
  codeBaseRegular,
  codeSmallBold,
  codeSmallRegular,
  codeSmallestBold,
  codeSmallestRegular,
  fontSmallestBold,
  fontSmallestRegular,
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
    return isBold ? codeSmallestBold : codeSmallestRegular;
  }
  if (type === 'code' && variant === 'small') {
    return isBold ? codeSmallBold : codeSmallRegular;
  }

  if (type === 'code' && variant === 'base') {
    return isBold ? codeBaseBold : codeBaseRegular;
  }

  if (variant === 'smallest') {
    return isBold ? fontSmallestBold : fontSmallestRegular;
  }
  if (variant === 'small') {
    return isBold ? bodySmallBold : bodySmallRegular;
  }

  return isBold ? bodyBaseBold : bodyBaseRegular;
}

export interface ITextProps {
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
}) => {
  const classList = cn(
    getFontClass(variant, bold, as),
    colorVariants[color],
    transformVariants[transform],
  );

  // making sure that the variant is one of the allowed ones in case typescript is ignored or not used
  const Element = TEXT_ELEMENTS.includes(as) ? as : 'span';
  return <Element className={classList}>{children}</Element>;
};
