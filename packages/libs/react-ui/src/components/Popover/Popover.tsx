import { filterDOMProps, mergeProps, useObjectRef } from '@react-aria/utils';
import type { ForwardedRef, ReactNode, RefObject } from 'react';
import React, { forwardRef } from 'react';
import type { AriaPopoverProps, PositionProps } from 'react-aria';
import { DismissButton, Overlay, usePopover } from 'react-aria';
import type { OverlayTriggerProps, OverlayTriggerState } from 'react-stately';
import { useOverlayTriggerState } from 'react-stately';
import { useEnterAnimation, useExitAnimation } from '../../utils/useAnimation';
import { arrowClass, popoverClass, underlayClass } from './Popover.css';

interface ICommonProps {
  state?: OverlayTriggerState;
  children: ReactNode;
  /**
   * Whether the show the arrow pointing to the trigger element.
   */
  showArrow?: boolean;
  /**
   * The name of the component that triggered the popover. This is reflected on the element
   * as the `data-trigger` attribute, and can be used to provide specific
   * styles for the popover depending on which element triggered it.
   */
  trigger?: string;
  /**
   * Whether the popover is currently performing an entry animation.
   */
  isEntering?: boolean;
  /**
   * Whether the popover is currently performing an exit animation.
   */
  isExiting?: boolean;
  /**
   * Whether the popover should resize to match the width of its trigger.
   * @default true
   */
  resizeToTrigger?: boolean;
  /**
   * The additional offset applied along the main axis between the element and its
   * anchor element.
   * @default 8
   */
  offset?: number;
  /**
   * The container element in which the overlay portal will be placed. This may have unknown behavior depending on where it is portalled to.
   * @default document.body
   */
  portalContainer?: Element;
}
export interface IPopoverProps
  extends Omit<PositionProps, 'isOpen'>,
    Omit<AriaPopoverProps, 'popoverRef' | 'offset'>,
    OverlayTriggerProps,
    ICommonProps {}

function PopoverBase(
  props: IPopoverProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  const ref = useObjectRef(forwardedRef);
  const localState = useOverlayTriggerState(props);
  const state = props.state || localState;
  const isExiting =
    useExitAnimation(ref, state.isOpen) || props.isExiting || false;

  if (state && !state.isOpen && !isExiting) {
    return null;
  }

  return (
    <PopoverInner
      {...props}
      state={state}
      popoverRef={ref}
      isExiting={isExiting}
    />
  );
}

interface IPopoverInnerProps extends AriaPopoverProps, IPopoverProps {
  state: OverlayTriggerState;
}

function PopoverInner({
  state,
  isExiting,
  portalContainer,
  resizeToTrigger = true,
  ...props
}: IPopoverInnerProps) {
  const { popoverProps, underlayProps, arrowProps, placement } = usePopover(
    {
      ...props,
      offset: props.offset ?? 8,
      arrowBoundaryOffset: props.arrowBoundaryOffset ? 10 : undefined,
    },
    state,
  );
  const ref = props.popoverRef as RefObject<HTMLDivElement>;
  const isEntering =
    useEnterAnimation(ref, !!placement) || props.isEntering || false;
  const triggerWidth = props.triggerRef?.current?.clientWidth;
  const style = {
    ...popoverProps.style,
    minWidth: resizeToTrigger ? triggerWidth : undefined,
  };
  return (
    <Overlay isExiting={isExiting} portalContainer={portalContainer}>
      {!props.isNonModal && state.isOpen && (
        <div {...underlayProps} className={underlayClass} />
      )}
      <div
        {...mergeProps(filterDOMProps(props as any), popoverProps)}
        style={style}
        ref={ref}
        className={popoverClass}
        data-trigger={props.trigger}
        data-placement={placement}
        data-entering={isEntering || undefined}
        data-exiting={isExiting || undefined}
      >
        {!props.isNonModal && <DismissButton onDismiss={state.close} />}
        {props.showArrow && (
          <svg
            {...arrowProps}
            className={arrowClass}
            data-placement={placement}
            viewBox="0 0 12 12"
          >
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        )}
        {props.children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}

export const Popover = forwardRef(PopoverBase);
