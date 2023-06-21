import { Modal } from './Modal';

import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

//Defining context
interface IModalContext {
  renderModal: (v: ReactNode) => void;
  clearModal: () => void;
}

export const ModalContext = createContext<IModalContext>({
  renderModal: (v: ReactNode) => {},
  clearModal: () => {},
});

export interface IModalProviderProps {
  children?: ReactNode;
}

export const ModalProvider: FC<IModalProviderProps> = ({ children }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const ref = useRef<Element | null>(null);
  const [content, setContent] = useState<ReactNode>();

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>('#modalportal');
    setMounted(true);
  }, []);

  const renderModal = (node: ReactNode): void => {
    setContent(node);
  };

  const clearModal = (): void => {
    setContent(undefined);
  };

  return (
    <ModalContext.Provider value={{ renderModal, clearModal }}>
      {children}
      {mounted &&
        ref.current &&
        Boolean(content) &&
        createPortal(
          <>
            <Modal>{content}</Modal>
          </>,
          ref.current,
        )}
    </ModalContext.Provider>
  );
};

export const useModal = (): IModalContext => useContext(ModalContext);
