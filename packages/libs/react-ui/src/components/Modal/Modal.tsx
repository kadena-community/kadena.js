import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';

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
        <Stack direction="column">
          <Button onClick={clearModal} title="Close modal">
            Close{' '}
          </Button>
          <section className={modal}>{children}</section>
        </Stack>
      </div>
    </>
  );
};
