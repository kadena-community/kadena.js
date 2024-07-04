import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { loadingPillClass } from './style.css';

const LoadingPill: FC<{ className?: string }> = ({ className }) => {
  return <span className={classNames(loadingPillClass, className)} />;
};

export default LoadingPill;
