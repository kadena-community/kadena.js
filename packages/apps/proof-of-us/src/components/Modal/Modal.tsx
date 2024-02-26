//@TODO: this modal needs to much nicer. but for now it does the job

import { Stack } from '@kadena/react-ui';
import type { FC, MouseEventHandler, PropsWithChildren } from 'react';
import { useRef } from 'react';
import { Heading } from '../Typography/Heading';
import { backgroundClass, dialogClass } from './style.css';

interface IProps extends PropsWithChildren {
  label: string;
  onClose: () => void;
}

export const Modal: FC<IProps> = ({ label, children, onClose }) => {
  const backRef = useRef<HTMLDivElement>(null);

  const handleClose: MouseEventHandler<HTMLDivElement> = (evt) => {
    evt.preventDefault();
    if (evt.target !== backRef.current) return;
    onClose();
  };
  return (
    <div ref={backRef} className={backgroundClass} onClick={handleClose}>
      <section className={dialogClass}>
        <Stack paddingBlockEnd="md">
          <Heading as="h5">{label}</Heading>
        </Stack>
        {children}
      </section>
    </div>
  );
};
