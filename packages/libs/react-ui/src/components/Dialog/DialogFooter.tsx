import { Stack } from '@components/Layout';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { footerClass } from './Dialog.css';

export interface IDialogFooterProps {
  children: ReactNode;
}

export const DialogFooter: FC<IDialogFooterProps> = ({ children }) => {
  return (
    <Stack
      gap="$md"
      justifyContent="flex-end"
      alignItems="center"
      marginTop="$xl"
      className={footerClass}
    >
      {children}
    </Stack>
  );
};
