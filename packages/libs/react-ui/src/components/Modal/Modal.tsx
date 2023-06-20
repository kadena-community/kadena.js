import { background, modal, wrapper } from './Modal.css';
import { useModal } from './ModalProvider';

import React, { FC } from 'react';

export interface IModalProps {
  children: React.ReactNode;
}

export const Modal: FC<IModalProps> = ({ children }) => {
  const { clearModal } = useModal();
  return (
    <>
      <button className={background} onClick={clearModal} />
      <div className={wrapper}>
        <section className={modal}>{children}</section>
      </div>
    </>
  );
};
