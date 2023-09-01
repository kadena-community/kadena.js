import { type ILayout, type LayoutType } from '@/types/Layout';
import { type FC } from 'react';

export const isOneOfLayoutType = (
  layout?: FC<ILayout> | LayoutType,
  ...args: string[]
): boolean => {
  if (layout === undefined) return false;
  if (typeof layout === 'string') {
    return args.some((displayName) => displayName === layout.toLowerCase());
  }

  return args.some(
    (displayName) => displayName === layout.displayName?.toLowerCase(),
  );
};
