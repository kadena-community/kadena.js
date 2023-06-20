import { background, wrapper } from './Modal.css';

import className from 'classnames';
import React, { FC } from 'react';

export interface IModalProps {
  children: React.ReactNode;
}

export const Modal: FC<IModalProps> = ({ children }) => {
  return (
    <>
      <div className={background}></div>
      <section className={wrapper}>{children}</section>
    </>
  );
};
