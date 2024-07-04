import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import LoadingPill from '../loading-pill';

interface IProps {
  isLoading: boolean;
}

const ValueLoader: FC<PropsWithChildren<IProps>> = ({
  isLoading,
  children,
}) => {
  if (isLoading) return <LoadingPill />;

  return children;
};

export default ValueLoader;
