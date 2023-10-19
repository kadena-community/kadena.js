import type { FC } from 'react';
import type { IModalContentProps } from './ModalContent';
import { ModalContent } from './ModalContent';
import type { IModalRootProps } from './ModalRoot';
import { ModalRoot } from './ModalRoot';
import type { IModalTriggerProps } from './ModalTrigger';
import { ModalTrigger } from './ModalTrigger';

export { IModalContentProps, IModalRootProps, IModalTriggerProps };

export interface IModalProps {
  Root: FC<IModalRootProps>;
  Trigger: FC<IModalTriggerProps>;
  Content: FC<IModalContentProps>;
}

export const Modal: IModalProps = {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Content: ModalContent,
};
