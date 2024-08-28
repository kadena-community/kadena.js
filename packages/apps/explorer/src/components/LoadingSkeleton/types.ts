import type { FC } from 'react';

export type ILoadingVariants = 'default' | 'icon';

export interface ITableField {
  width: any;
  variant?: 'body' | 'code';
  align?: 'start' | 'end' | 'center';
  label: string;
  key: string | string[];
  render?: FC<{ value: string }> | FC<{ value: string }>[];
  isLoading?: boolean;
  loaderVariant?: ILoadingVariants;
}
