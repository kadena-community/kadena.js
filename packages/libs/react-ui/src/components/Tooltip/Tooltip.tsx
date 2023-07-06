import { arrowLeft, container } from './Tooltip.css';

import React, { FC } from 'react';

export interface ITooltipProps {
  children: React.ReactNode;
}

export const Tooltip: FC<ITooltipProps> = ({ children }) => {
  return (
    <div className={container}>
      <div className={arrowLeft} />
      {children}
    </div>
  );
};
