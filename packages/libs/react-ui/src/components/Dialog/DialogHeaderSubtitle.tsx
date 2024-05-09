import cn from 'classnames';
import type { FC } from 'react';
import React, { useContext } from 'react';
import { Heading } from '../Typography';
import { DialogContext } from './Dialog.context';
import { subtitleWrapperClass } from './Dialog.css';
import type { IDialogHeaderProps } from './DialogHeader';

export const DialogHeaderSubtitle: FC<IDialogHeaderProps> = ({
  children,
  className,
}) => {
  const { titleProps } = useContext(DialogContext);
  return (
    <div className={cn(subtitleWrapperClass, className)} {...titleProps}>
      {typeof children === 'string' ? (
        <Heading as="h6">{children}</Heading>
      ) : (
        children
      )}
    </div>
  );
};
