import { ILayout, LayoutType } from '@/types/Layout';
import { FC } from 'react';

export const isOneOfLayoutType = (
  layout: FC<ILayout> | LayoutType,
  ...args: string[]
): boolean => {
  console.log(layout);
  if (typeof layout === 'string') {
    return args.some((displayName) => displayName === layout.toLowerCase());
  }

  return args.some(
    (displayName) => displayName === layout.displayName?.toLowerCase(),
  );
};
