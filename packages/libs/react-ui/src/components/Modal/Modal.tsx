import { Button } from '../Button/Button';
import { SystemIcon } from '../Icons';
import { Stack } from '../Stack/Stack';

import { background, closeButton, modal, wrapper } from './Modal.css';
import { useModal } from './ModalProvider';

import React, { FC } from 'react';

export interface IModalProps {
  children: React.ReactNode;
}

export const Modal: FC<IModalProps> = ({ children }) => {
  const { clearModal } = useModal();
  return (
    <>
      <button
        data-cy="modal-background"
        className={background}
        onClick={clearModal}
      />
      <div className={wrapper} data-cy="modal">
        <Stack direction="column" alignItems="flex-end" spacing="2xs">
          <button
            className={closeButton}
            onClick={clearModal}
            title="Close modal"
          >
            Close
            <SystemIcon.Close />
          </button>
          <section className={modal}>{children}</section>
        </Stack>
      </div>
    </>
  );
};
