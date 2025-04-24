import type { FC } from 'react';
import React, { useRef } from 'react';
import type { AriaPopoverProps } from 'react-aria';
import { Overlay, usePopover } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';
import { underlayClass } from './style.css';

interface IPopoverProps extends Omit<AriaPopoverProps, 'popoverRef'> {
  children: React.ReactNode;
  state: OverlayTriggerState;
}

export const Popover: FC<IPopoverProps> = ({
  children,
  state,
  offset = 8,
  ...props
}) => {
  const popoverRef = useRef(null);
  const { popoverProps, underlayProps } = usePopover(
    {
      ...props,
      offset,
      popoverRef,
    },
    state,
  );

  return (
    <>
      <Overlay>
        <div {...underlayProps} className={underlayClass} />
        <div {...popoverProps} ref={popoverRef} className="popover">
          {children}
        </div>
      </Overlay>
    </>
  );
};
