import type { FC } from 'react';

export type ILoadingVariants = 'default' | 'icon';

export interface ITableField {
  width: any;
  variant?: 'body' | 'code';
  label: string;
  key: string;
  render?: FC<{ value: string }>;
  isLoading?: boolean;
  loaderVariant?: ILoadingVariants;
}
