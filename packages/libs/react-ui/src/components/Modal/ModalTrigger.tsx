'use client';

import type { IButtonProps } from '@components/Button';
import { Button } from '@components/Button';
import type { FC } from 'react';
import React, { useContext } from 'react';
import { ModalContext } from './Modal.context';

export interface IModalTriggerProps extends IButtonProps {
  children: React.ReactNode;
}

export const ModalTrigger: FC<IModalTriggerProps> = (
  { children, ...buttonProps },
) => {
  const { triggerProps } = useContext(ModalContext);
  const { onPress, ...restTriggerProps } = triggerProps;

  return (
    <Button {...restTriggerProps} {...buttonProps} onClick={onPress}>
      {children}
    </Button>
  );
};
