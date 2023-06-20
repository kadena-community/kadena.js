import { background, modal, wrapper } from './Modal.css';
import { useModal } from './ModalProvider';

import className from 'classnames';
import React, { FC } from 'react';

export interface IModalProps {
  children: React.ReactNode;
}

export const Modal: FC<IModalProps> = ({ children }) => {
  const { setOpenModal, openModal } = useModal();

  if (!openModal) return null;

  return (
    <>
      <button
        className={background}
        onClick={() => setOpenModal(false)}
      ></button>
      <div className={wrapper}>
        <section className={modal}>{children}</section>
      </div>
    </>
  );
};
