import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { loadingPillClass, loadingVariants } from './style.css';
import type { ILoadingVariants } from './types';

interface IProps {
  className?: string;
  variant: ILoadingVariants;
}

const LoadingPill: FC<IProps> = ({ className, variant }) => {
  return (
    <span
      className={classNames(
        loadingVariants({ variant }),
        loadingPillClass,
        className,
      )}
    />
  );
};

export default LoadingPill;
