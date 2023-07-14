import { arrowLeft, container } from './Tooltip.css';

import React, { forwardRef } from 'react';

export interface ITooltipProps {
  children: React.ReactNode;
}

export const Tooltip: React.ForwardRefExoticComponent<
  Omit<ITooltipProps, 'ref'> & React.RefAttributes<HTMLDivElement>
  // eslint-disable-next-line react/display-name
> = forwardRef<HTMLDivElement, ITooltipProps>(({ children }, ref) => {
  return (
    <div className={container} ref={ref}>
      <div className={arrowLeft} />
      {children}
    </div>
  );
});
