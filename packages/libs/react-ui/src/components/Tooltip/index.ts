import type { ITooltipProps } from './Tooltip';
import { Tooltip as TooltipComponent } from './Tooltip';
import { tooltipHandler } from './tooltipHandler';

export { ITooltipProps };

interface ITooltip {
  Root: React.ForwardRefExoticComponent<
    Omit<ITooltipProps, 'ref'> & React.RefAttributes<HTMLDivElement>
  >;
  handler: typeof tooltipHandler;
}

export const Tooltip: ITooltip = {
  Root: TooltipComponent,
  handler: tooltipHandler,
};
