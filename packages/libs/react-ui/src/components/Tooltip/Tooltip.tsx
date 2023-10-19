import React, { forwardRef } from 'react';
import { arrowVariants, container } from './Tooltip.css';

export interface ITooltipProps {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export const Tooltip: React.ForwardRefExoticComponent<
  Omit<ITooltipProps, 'ref'> & React.RefAttributes<HTMLDivElement>
  // eslint-disable-next-line react/display-name
> = forwardRef<HTMLDivElement, ITooltipProps>(
  ({ children, placement = 'right' }, ref) => {
    return (
      <div className={container} ref={ref} data-placement={placement}>
        <div className={arrowVariants[placement]} />
        {children}
      </div>
    );
  },
);
