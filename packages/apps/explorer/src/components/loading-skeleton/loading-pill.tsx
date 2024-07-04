import type { FC } from 'react';
import React from 'react';
import { loadingPillClass } from './style.css';

const LoadingPill: FC = () => {
  return <span className={loadingPillClass} />;
};

export default LoadingPill;
