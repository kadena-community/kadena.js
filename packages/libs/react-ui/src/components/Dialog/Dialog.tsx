import { MonoClose } from '@kadena/react-icons/system';
import { useObjectRef } from '@react-aria/utils';
import cn from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import type { AriaDialogProps } from 'react-aria';
import { mergeProps, useDialog } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';
import { useOverlayTriggerState } from 'react-stately';
import type { IModalProps } from '../Modal/Modal';
import { Modal } from '../Modal/Modal';
import { DialogContext } from './Dialog.context';
import {
  baseClass,
  closeButtonClass,
  compactClass,
  largeClass,
  overlayClass,
} from './Dialog.css';

const classMap = {
  compact: compactClass,
  base: baseClass,
  large: largeClass,
};
interface IBaseDialogProps
  extends Omit<IModalProps, 'children'>,
    AriaDialogProps {
  children?: ((state: OverlayTriggerState) => ReactNode) | ReactNode;
  className?: string;
  size?: 'compact' | 'base' | 'large';
}

const BaseDialog = React.forwardRef<HTMLDivElement, IBaseDialogProps>(
  (props, ref) => {
    const {
      className,
      children,
      isDismissable = true,
      size = 'base',
      state,
      ...rest
    } = props;
    const dialogRef = useObjectRef<HTMLDivElement | null>(ref);
    const { dialogProps, titleProps } = useDialog(
      {
        role: props.role ?? 'dialog',
        ...rest,
      },
      dialogRef,
    );

    return (
      <DialogContext.Provider value={{ titleProps, state }}>
        <div
          ref={dialogRef}
          className={cn(
            overlayClass,
            className,
            classMap[props.size ?? 'base'],
          )}
          {...mergeProps(rest, dialogProps)}
        >
          {typeof children === 'function' ? children(state) : children}

          {isDismissable && (
            <button
              className={closeButtonClass}
              onClick={state.close}
              aria-label="Close Modal"
              title="Close Modal"
            >
              <MonoClose />
            </button>
          )}
        </div>
      </DialogContext.Provider>
    );
  },
);

BaseDialog.displayName = 'BaseDialog';

export interface IDialogProps extends Omit<IBaseDialogProps, 'state'> {
  children?: ((state: OverlayTriggerState) => ReactNode) | ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const Dialog: FC<IDialogProps> = ({
  children,
  isDismissable = true,
  isKeyboardDismissDisabled,
  isOpen,
  defaultOpen,
  onOpenChange,
  ...props
}) => {
  const state = useOverlayTriggerState({
    isOpen,
    defaultOpen,
    onOpenChange,
  });

  return (
    <Modal isKeyboardDismissDisabled={isKeyboardDismissDisabled} state={state}>
      <BaseDialog state={state} isDismissable={isDismissable} {...props}>
        {children}
      </BaseDialog>
    </Modal>
  );
};
