import type { FC, PropsWithChildren } from 'react';
import React, { useRef } from 'react';
import type { AriaMenuProps } from 'react-aria';
import { FocusScope, useMenu, useMenuTrigger } from 'react-aria';
import { useMenuTriggerState, useTreeState } from 'react-stately';
import { Popover } from './Popover';
import { contextMenuClass } from './style.css';

export type IContextMenuProps = PropsWithChildren & {
  trigger: React.ReactElement;
  placement?: 'bottom start' | 'bottom end' | 'top start' | 'top end';
};

export const ContextMenu: FC<IContextMenuProps> = ({
  children,
  trigger,
  ...props
}) => {
  const ref = useRef(null);
  const menuReref = useRef(null);
  const state = useMenuTriggerState({});

  const { menuTriggerProps, menuProps: menuWrapperProps } = useMenuTrigger(
    {},
    state,
    ref,
  );
  const treeState = useTreeState({
    ...menuWrapperProps,
  } as AriaMenuProps<{}>);
  const { menuProps } = useMenu(menuWrapperProps, treeState, ref);

  return (
    <>
      {React.cloneElement(trigger, {
        ...trigger.props,
        ...menuTriggerProps,
        ref,
      })}
      {state.isOpen && (
        <>
          <Popover {...props} triggerRef={ref} state={state}>
            <div
              ref={menuReref}
              {...menuProps}
              className={contextMenuClass}
              onClick={state.close}
            >
              <FocusScope contain restoreFocus autoFocus>
                {children}
              </FocusScope>
            </div>
          </Popover>
        </>
      )}
    </>
  );
};
