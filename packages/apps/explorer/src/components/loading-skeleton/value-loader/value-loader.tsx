import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import LoadingPill from '../loading-pill';

interface IProps {
  isLoading: boolean;
  className?: string;
}

const ValueLoader: FC<PropsWithChildren<IProps>> = ({
  isLoading,
  children,
  className,
}) => {
  if (isLoading) return <LoadingPill className={className} />;

  return children;
};

export default ValueLoader;
