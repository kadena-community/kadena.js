import { ITooltipProps, Tooltip as TooltipComponent } from './Tooltip';
import tooltipHandler from './tooltipHandler';

export { ITooltipProps };

interface ITooltip {
  Root: typeof TooltipComponent;
  handler: typeof tooltipHandler;
}

export const Tooltip: ITooltip = {
  Root: TooltipComponent,
  handler: tooltipHandler,
};
