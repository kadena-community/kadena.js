import type { FC, PropsWithChildren } from 'react';
import { useEventListener } from 'usehooks-ts';
import { backdrop, container } from './Modal.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  children,
  open,
  onClose,
}) => {
  useEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  });

  if (!open) return null;

  const onClickBackdrop = () => {
    onClose();
  };

  return (
    <>
      <div className={backdrop} onClick={onClickBackdrop} />
      <dialog className={container} open>
        {children}
      </dialog>
    </>
  );
};
