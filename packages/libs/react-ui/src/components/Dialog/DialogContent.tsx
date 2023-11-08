import type { FC, ReactNode } from 'react';
import React, { useContext } from 'react';
import { Heading } from '../Typography';
import { DialogContext } from './Dialog.context';
import { contentClass } from './Dialog.css';

export interface IDialogContentProps {
  children: ReactNode;
}

export const DialogContent: FC<IDialogContentProps> = ({ children }) => {
  const { titleProps } = useContext(DialogContext);

  return (
    <div className={contentClass} {...titleProps}>
      {typeof children === 'string' ? (
        <Heading as="h3">{children}</Heading>
      ) : (
        children
      )}
    </div>
  );
};
