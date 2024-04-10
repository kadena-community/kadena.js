import type { OverlayTriggerProps } from 'react-aria';
import { useOverlayTrigger } from 'react-aria';
import type { OverlayTriggerProps as OverlayTriggerStateProps } from 'react-stately';
import { useOverlayTriggerState } from 'react-stately';

import { useObjectRef } from '@react-aria/utils';
import type { ForwardedRef, ReactElement } from 'react';
import React, { cloneElement, forwardRef } from 'react';
import type { IButtonProps } from '../Button';
import { Button } from '../Button';
import { Popover } from './Popover';

type PopoverButtonProps = Pick<
  IButtonProps,
  'endVisual' | 'variant' | 'isCompact' | 'isLoading' | 'isDisabled'
>;
interface IPopoverTriggerProps
  extends PopoverButtonProps,
    OverlayTriggerProps,
    OverlayTriggerStateProps {
  label: string;
  children: ReactElement;
}

function PopoverTriggerBase(
  props: IPopoverTriggerProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
) {
  const ref = useObjectRef(forwardedRef);
  const state = useOverlayTriggerState(props);
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
    ref,
  );

  return (
    <>
      <Button
        {...(triggerProps as IButtonProps)}
        ref={ref}
        endVisual={props.endVisual}
        variant={props.variant}
        isCompact={props.isCompact}
        isLoading={props.isLoading}
        isDisabled={props.isDisabled}
      >
        {props.label}
      </Button>
      {state.isOpen && (
        <Popover {...props} triggerRef={ref} state={state}>
          {cloneElement(props.children, overlayProps)}
        </Popover>
      )}
    </>
  );
}

export const PopoverTrigger = forwardRef(PopoverTriggerBase);
