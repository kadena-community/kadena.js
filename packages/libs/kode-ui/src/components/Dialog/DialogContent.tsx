import cn from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { contentClass } from './Dialog.css';

export interface IDialogContentProps {
  children: ReactNode;
  className?: string;
}

export const DialogContent: FC<IDialogContentProps> = ({
  children,
  className,
}) => {
  return <div className={cn(contentClass, className)}>{children}</div>;
};
