import { mergeRefs } from '@react-aria/utils';
import type { FC, ReactElement, ReactNode } from 'react';
import React, { cloneElement, useRef } from 'react';
import { useTooltip, useTooltipTrigger } from 'react-aria';
import type { TooltipTriggerProps } from 'react-stately';
import { useTooltipTriggerState } from 'react-stately';
import { Box } from '../Layout';
import { tooltipPositionVariants } from './Tooltip.css';
export interface ITooltipProps
  extends Omit<TooltipTriggerProps, 'trigger' | 'onOpenChange'> {
  children: ReactElement;
  content: ReactNode;
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
      {cloneElement(children, {
        ...triggerProps,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref: mergeRefs(ref, (children as any).ref),
      })}

      {state.isOpen && (
        <span className={tooltipPositionVariants[position]} {...tooltipProps}>
          {content}
        </span>
      )}
    </Box>
  );
};
