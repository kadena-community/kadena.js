import type { CSSProperties, FC } from 'react';
import React from 'react';

import type { AriaPopoverProps } from 'react-aria';
import { DismissButton, Overlay, usePopover } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';
import { popoverClass } from './Popover.css';

export interface IPopoverProps extends AriaPopoverProps {
  children: React.ReactNode;
  state: OverlayTriggerState;
  width: CSSProperties['width'];
}

export const Popover: FC<IPopoverProps> = ({
  children,
  state,
  width,
  ...props
}: IPopoverProps) => {
  const { popoverProps } = usePopover(props, state);

  return (
    <Overlay>
      <div
        {...popoverProps}
        ref={props.popoverRef as React.RefObject<HTMLDivElement>}
        className={popoverClass}
        style={{
          ...popoverProps.style,
          width,
        }}
      >
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
};
