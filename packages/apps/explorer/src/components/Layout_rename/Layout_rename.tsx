import { Footer } from '@/components/Footer_rename/Footer_rename';
import { Header } from '@/components/Header_rename/Header_rename';
import { Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { contentClass, documentStyle, layoutWrapperClass } from './styles.css';

interface IProps {
  children?: ReactNode;
}

export const Layout: FC<IProps> = ({ children }: IProps) => {
  return (
    <div className={documentStyle}>
      <Header />
      <Stack
        as="main"
        flexDirection="column"
        className={classNames(layoutWrapperClass, contentClass)}
      >
        {children}
      </Stack>
      <Footer />
    </div>
  );
};
