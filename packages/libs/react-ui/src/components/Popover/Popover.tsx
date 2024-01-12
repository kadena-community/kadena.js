import { useObjectRef } from '@react-aria/utils';
import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import type { AriaPopoverProps } from 'react-aria';
import { DismissButton, Overlay, usePopover } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';
import { arrowClass, popoverClass, underlayClass } from './Popover.css';

interface IPopoverProps extends Omit<AriaPopoverProps, 'popoverRef'> {
  children: React.ReactNode;
  state: OverlayTriggerState;
  showArrow?: boolean;
  resizeToTrigger?: boolean;
}

function PopoverBase(
  {
    children,
    state,
    offset = 8,
    showArrow = true,
    arrowBoundaryOffset = 10,
    resizeToTrigger = true,
    triggerRef,
    ...props
  }: IPopoverProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  const popoverRef = useObjectRef(forwardedRef);
  const { popoverProps, underlayProps, arrowProps, placement } = usePopover(
    {
      ...props,
      triggerRef,
      arrowBoundaryOffset,
      offset,
      popoverRef,
    },
    state,
  );
  const triggerWidth = triggerRef?.current?.clientWidth;

  return (
    <Overlay>
      <div {...underlayProps} className={underlayClass} />
      <div
        {...popoverProps}
        style={{
          ...popoverProps.style,
          minWidth: resizeToTrigger ? triggerWidth : undefined,
        }}
        ref={popoverRef}
        className={popoverClass}
      >
        {showArrow && (
          <svg
            {...arrowProps}
            className={arrowClass}
            data-placement={placement}
            viewBox="0 0 12 12"
          >
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        )}
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}

export const Popover = forwardRef(PopoverBase);
