import type { CSSProperties } from 'react';
import React, { useRef } from 'react';

import type { AriaPopoverProps } from 'react-aria';
import { DismissButton, Overlay, usePopover } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';
import { IBoxProps } from '..';

export interface IPopoverProps extends AriaPopoverProps {
  children: React.ReactNode;
  state: OverlayTriggerState;
  width: CSSProperties['width'];
}

// export const Popover: FC<IPopoverProps> = ({
//   children,
//   state,
//   offset = 8,
//   ...props
// }) => {
//   const popoverRef = useRef(null);
//   const { popoverProps, underlayProps, arrowProps, placement } = usePopover(
//     {
//       ...props,
//       offset,
//       popoverRef,
//     },
//     state,
//   );

//   return (
//     <Overlay>
//       <div {...underlayProps} className="underlay" />
//       <div {...popoverProps} ref={popoverRef} className="popover">
//         <svg
//           {...arrowProps}
//           className="arrow"
//           data-placement={placement}
//           viewBox="0 0 12 12"
//         >
//           <path d="M0 0 L6 6 L12 0" />
//         </svg>
//         <DismissButton onDismiss={state.close} />
//         {children}
//         <DismissButton onDismiss={state.close} />
//       </div>
//     </Overlay>
//   );
// };

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Popover = ({
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
        style={{
          ...popoverProps.style,
          background: 'lightgray',
          border: '1px solid gray',
          width,
        }}
      >
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
};
