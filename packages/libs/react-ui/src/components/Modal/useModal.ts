'use client';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

interface IModalContext {
  renderModal: (
    v: ReactNode,
    title?: string,
    onCloseCallback?: () => void,
  ) => void;
  clearModal: () => void;
}

export const ModalContext = createContext<IModalContext>({
  renderModal: (
    v: ReactNode,
    title?: string,
    onCloseCallback?: () => void,
  ) => {},
  clearModal: () => {},
});

export const useModal = (): IModalContext => useContext(ModalContext);
