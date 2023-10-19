'use client';

import { useOverlayTrigger } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';

import type { OverlayTriggerProps } from 'react-stately';

import type { FC } from 'react';
import React from 'react';
import { ModalContext } from './Modal.context';

export interface IModalRootProps extends OverlayTriggerProps {
  children: React.ReactNode;
}

export const ModalRoot: FC<IModalRootProps> = ({ children, ...restProps }) => {
  const state = useOverlayTriggerState(restProps);
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
  );

  return (
    <ModalContext.Provider value={{ state, triggerProps, overlayProps }}>
      {children}
    </ModalContext.Provider>
  );
};
