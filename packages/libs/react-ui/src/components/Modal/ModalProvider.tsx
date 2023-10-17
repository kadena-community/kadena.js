'use client';

import { Modal } from './Modal';
import { openModal } from './Modal.css';
import { ModalContext } from './useModal';

import type { FC, ReactNode } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface IModalProviderProps {
  children?: ReactNode;
}

export const ModalProvider: FC<IModalProviderProps> = ({ children }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const ref = useRef<Element | null>(null);
  const [content, setContent] = useState<ReactNode>();
  const [onCloseCallback, setOnCloseCallback] = useState<() => void>();

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>('#modalportal');
    setMounted(true);
  }, []);

  const renderModal = useCallback(
    (node: ReactNode, title?: string, onClose?: () => void): void => {
      setContent(node);
      setTitle(title);
      setOnCloseCallback(() => onClose);
    },
    [],
  );

  const clearModal = useCallback((): void => {
    onCloseCallback?.();
    setContent(undefined);
    setTitle(undefined);
  }, []);

  const isOpen: boolean = mounted && Boolean(ref.current) && Boolean(content);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add(openModal);
    } else {
      document.body.classList.remove(openModal);
    }
  }, [isOpen]);

  return (
    <ModalContext.Provider value={{ renderModal, clearModal }}>
      {children}
      {isOpen &&
        ref.current &&
        createPortal(
          <>
            <Modal title={title} onClose={onCloseCallback}>
              {content}
            </Modal>
          </>,
          ref.current,
        )}
    </ModalContext.Provider>
  );
};
