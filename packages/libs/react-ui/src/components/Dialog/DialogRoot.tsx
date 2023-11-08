import { useObjectRef } from '@react-aria/utils';
import type { FC, ReactNode } from 'react';
import React from 'react';
import type { AriaDialogProps } from 'react-aria';
import { mergeProps, useDialog } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';
import { useOverlayTriggerState } from 'react-stately';
import { SystemIcon } from '../Icon';
import type { IModalProps } from '../Modal/Modal';
import { Modal } from '../Modal/Modal';
import { DialogContext } from './Dialog.context';
import { closeButtonClass, overlayClass } from './Dialog.css';

interface IBaseDialogProps
  extends Omit<IModalProps, 'children'>,
    AriaDialogProps {
  children?: ((state: OverlayTriggerState) => ReactNode) | ReactNode;
}

const BaseDialog = React.forwardRef<HTMLDivElement, IBaseDialogProps>(
  (props, ref) => {
    const { children, isDismissable = true, state, ...rest } = props;
    const dialogRef = useObjectRef<HTMLDivElement | null>(ref);
    const { dialogProps, titleProps } = useDialog(
      {
        role: props.role ?? 'dialog',
        ...rest,
      },
      dialogRef,
    );

    return (
      <DialogContext.Provider value={{ titleProps }}>
        <div
          ref={dialogRef}
          className={overlayClass}
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
              <SystemIcon.Close />
            </button>
          )}
        </div>
      </DialogContext.Provider>
    );
  },
);

BaseDialog.displayName = 'BaseDialog';

export interface IDialogRootProps extends Omit<IBaseDialogProps, 'state'> {
  children?: ((state: OverlayTriggerState) => ReactNode) | ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const DialogRoot: FC<IDialogRootProps> = ({
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
