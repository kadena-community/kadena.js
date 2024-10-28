import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { footerWrapperClass } from '../sidebar.css';
import { Stack } from './../../../components';

interface IProps extends PropsWithChildren {}

export const SideBarFooter: FC<IProps> = ({ children }) => {
  return (
    <header className={footerWrapperClass}>
      <Stack width="100%" justifyContent="space-between" alignItems="center">
        {children}
      </Stack>
    </header>
  );
};
