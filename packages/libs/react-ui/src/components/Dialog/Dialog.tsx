import { useObjectRef } from '@react-aria/utils';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import type { AriaDialogProps } from 'react-aria';
import { mergeProps, useDialog } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';
import { useOverlayTriggerState } from 'react-stately';
import { containerClass as cardContainerClass } from '../Card/Card.css';
import { SystemIcon } from '../Icon';
import type { IModalProps } from '../Modal/Modal';
import { Modal } from '../Modal/Modal';
import { Heading } from '../Typography';
import {
  closeButtonClass,
  overlayClass,
  titleWrapperClass,
} from './Dialog.css';

interface IBaseDialogProps
  extends Omit<IModalProps, 'children'>,
    AriaDialogProps {
  title?: ReactNode;
  children?: ((state: OverlayTriggerState) => ReactNode) | ReactNode;
}

const BaseDialog = React.forwardRef<HTMLDivElement, IBaseDialogProps>(
  (props, ref) => {
    const { title, children, isDismissable = true, state, ...rest } = props;
    const dialogRef = useObjectRef<HTMLDivElement | null>(ref);
    const { dialogProps, titleProps } = useDialog(
      {
        role: props.role ?? 'dialog',
        ...rest,
      },
      dialogRef,
    );

    return (
      <div
        ref={dialogRef}
        className={classNames(cardContainerClass, overlayClass)}
        {...mergeProps(rest, dialogProps)}
      >
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

        {title && (
          <div className={titleWrapperClass} {...titleProps}>
            {typeof title === 'string' ? (
              <Heading as="h3">{title}</Heading>
            ) : (
              title
            )}
          </div>
        )}
        {typeof children === 'function' ? children(state) : children}
      </div>
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
  title,
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
      <BaseDialog
        state={state}
        title={title}
        isDismissable={isDismissable}
        {...props}
      >
        {children}
      </BaseDialog>
    </Modal>
  );
};
