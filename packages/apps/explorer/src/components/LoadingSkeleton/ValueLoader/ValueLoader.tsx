import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { LoadingPill } from '../LoadingPill';
import type { ILoadingVariants } from '../types';

interface IProps {
  isLoading: boolean;
  className?: string;
  variant?: ILoadingVariants;
}

export const ValueLoader: FC<PropsWithChildren<IProps>> = ({
  isLoading,
  children,
  className,
  variant = 'default',
}) => {
  if (isLoading) return <LoadingPill variant={variant} className={className} />;

  return children;
};
