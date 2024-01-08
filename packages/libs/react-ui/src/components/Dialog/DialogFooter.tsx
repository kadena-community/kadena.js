import { Stack } from '@components/Layout';
import cn from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { footerClass } from './Dialog.css';

export interface IDialogFooterProps {
  children: ReactNode;
  className?: string;
}

export const DialogFooter: FC<IDialogFooterProps> = ({
  children,
  className,
}) => {
  return (
    <Stack
      gap="md"
      justifyContent="flex-end"
      alignItems="center"
      marginBlockStart="xl"
      className={cn(footerClass, className)}
    >
      {children}
    </Stack>
  );
};
