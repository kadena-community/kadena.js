import type { FC } from 'react';
import type { IModalContentProps } from './ModalContent';
import { ModalContent } from './ModalContent';

import * as DialogPrimitive from '@radix-ui/react-dialog';

export { IModalContentProps };
export interface IModalRootProps extends DialogPrimitive.DialogProps {}
export interface IModalTriggerProps
  extends DialogPrimitive.DialogTriggerProps {}

export interface IModalProps {
  Root: FC<DialogPrimitive.DialogProps>;
  Trigger: FC<DialogPrimitive.DialogTriggerProps>;
  Content: FC<IModalContentProps>;
}

export const Modal: IModalProps = {
  Root: DialogPrimitive.Root,
  Trigger: DialogPrimitive.Trigger,
  Content: ModalContent,
};
