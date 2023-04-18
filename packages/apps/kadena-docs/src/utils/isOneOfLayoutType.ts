import { ILayout, LayoutType } from '@/components/Layout/types';
import { FC } from 'react';

export const isOneOfLayoutType = (
  layout: FC<ILayout> | LayoutType,
  ...args: string[]
): boolean => {
  if (typeof layout === 'string') {
    return args.some((displayName) => displayName === layout.toLowerCase());
  }

  return args.some(
    (displayName) => displayName === layout.displayName?.toLowerCase(),
  );
};
