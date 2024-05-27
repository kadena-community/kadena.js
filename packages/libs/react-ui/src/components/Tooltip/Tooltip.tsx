import { FocusableProvider } from '@react-aria/focus';
import classNames from 'classnames';
import type { FC, ReactElement, ReactNode } from 'react';
import React, { cloneElement, useRef } from 'react';
import { useTooltip, useTooltipTrigger } from 'react-aria';
import type { TooltipTriggerProps } from 'react-stately';
import { useTooltipTriggerState } from 'react-stately';
import { Box } from '../Layout';
import { tooltipPositionVariants, tooltipSizes } from './Tooltip.css';
export interface ITooltipProps
  extends Omit<TooltipTriggerProps, 'trigger' | 'onOpenChange'> {
  children: ReactElement;
  content: ReactNode;
  isCompact?: boolean;
  position?: keyof typeof tooltipPositionVariants;
}

export const Tooltip: FC<ITooltipProps> = ({
  children,
  content,
  position = 'right',
  isCompact = false,
  ...props
}) => {
  const config = {
    delay: 500,
    closeDelay: 300,
    ...props,
  };
  const state = useTooltipTriggerState(config);
  const ref = useRef(null);

  const { triggerProps, tooltipProps: baseTooltipProps } = useTooltipTrigger(
    config,
    state,
    ref,
  );

  const { tooltipProps } = useTooltip(baseTooltipProps, state);

  return (
    <Box position="relative">
      <FocusableProvider ref={ref} {...triggerProps}>
        {cloneElement(children, {
          ...triggerProps,
        })}
      </FocusableProvider>

      {state.isOpen && (
        <span
          className={classNames(
            tooltipPositionVariants[position],
            tooltipSizes[isCompact ? 'compact' : 'default'],
          )}
          {...tooltipProps}
        >
          {content}
        </span>
      )}
    </Box>
  );
};
