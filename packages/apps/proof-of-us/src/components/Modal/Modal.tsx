//@TODO: this modal needs to much nicer. but for now it does the job

import { Stack } from '@kadena/kode-ui';
import type {
  FC,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { useRef } from 'react';
import { backgroundClass, dialogClass, headerClass } from './style.css';

interface IProps extends PropsWithChildren {
  label: string | ReactNode;
  onClose: () => void;
}

export const Modal: FC<IProps> = ({ label, children, onClose }) => {
  const backRef = useRef<HTMLDivElement>(null);

  const handleClose: MouseEventHandler<HTMLDivElement> = (evt) => {
    if (evt.target !== backRef.current) return;
    evt.preventDefault();
    onClose();
  };
  return (
    <div ref={backRef} className={backgroundClass} onClick={handleClose}>
      <section className={dialogClass}>
        <Stack paddingBlockEnd="md">
          <header className={headerClass}>{label}</header>
        </Stack>
        {children}
      </section>
    </div>
  );
};
