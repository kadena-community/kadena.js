import { Box } from '@components/Layout';
import type { FC } from 'react';
import React, { cloneElement, useRef } from 'react';
import { useTooltip, useTooltipTrigger } from 'react-aria';
import type { TooltipTriggerProps } from 'react-stately';
import { useTooltipTriggerState } from 'react-stately';
import { tooltipPositionVariants } from './Tooltip.css';
export interface ITooltipProps extends Omit<TooltipTriggerProps, 'trigger'> {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: keyof typeof tooltipPositionVariants;
}

export const Tooltip: FC<ITooltipProps> = ({
  children,
  content,
  position = 'right',
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
      {cloneElement(children as React.ReactElement, { ...triggerProps, ref })}

      {state.isOpen && (
        <span className={tooltipPositionVariants[position]} {...tooltipProps}>
          {content}
        </span>
      )}
    </Box>
  );
};
