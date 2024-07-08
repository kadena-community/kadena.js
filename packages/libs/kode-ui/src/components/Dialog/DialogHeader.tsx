import cn from 'classnames';
import type { FC, ReactNode } from 'react';
import React, { useContext } from 'react';
import { Heading } from '../Typography';
import { DialogContext } from './Dialog.context';
import { titleWrapperClass } from './Dialog.css';

export interface IDialogHeaderProps {
  children: ReactNode;
  className?: string;
}

export const DialogHeader: FC<IDialogHeaderProps> = ({
  children,
  className,
}) => {
  const { titleProps } = useContext(DialogContext);

  return (
    <div className={cn(titleWrapperClass, className)} {...titleProps}>
      {typeof children === 'string' ? (
        <Heading as="h3">{children}</Heading>
      ) : (
        children
      )}
    </div>
  );
};
