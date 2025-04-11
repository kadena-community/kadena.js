import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useRef } from 'react';
import type { AriaMenuProps } from 'react-aria';
import { FocusScope, useMenu, useMenuTrigger } from 'react-aria';
import { useMenuTriggerState, useTreeState } from 'react-stately';
import { Popover } from './Popover';
import { contextMenuClass } from './style.css';

export type IContextMenuProps = PropsWithChildren & {
  trigger: React.ReactElement;
  placement?: 'bottom start' | 'bottom end' | 'top start' | 'top end';
  defaultOpen?: boolean;
};

export const ContextMenu: FC<IContextMenuProps> = ({
  children,
  trigger,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const state = useMenuTriggerState({ defaultOpen: props.defaultOpen });

  const { menuTriggerProps, menuProps: menuWrapperProps } = useMenuTrigger(
    {},
    state,
    ref,
  );

  const newMenuWrapperProps = { ...menuWrapperProps, autoFocus: false };

  const treeState = useTreeState({
    ...newMenuWrapperProps,
  } as AriaMenuProps<{}>);
  const { menuProps } = useMenu({ ...newMenuWrapperProps }, treeState, ref);

  useEffect(() => {
    if (!ref.current || !menuRef.current) return;

    const popover = document.querySelector('.popover') as HTMLDivElement;
    const maxHeight = popover?.style.maxHeight;

    const style = menuRef.current?.style;
    if (style) style.maxHeight = maxHeight ?? 'auto';
  }, [ref.current, menuRef.current]);

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
              ref={menuRef}
              {...menuProps}
              className={contextMenuClass}
              onClick={state.close}
            >
              <FocusScope contain autoFocus restoreFocus>
                {children}
              </FocusScope>
            </div>
          </Popover>
        </>
      )}
    </>
  );
};
