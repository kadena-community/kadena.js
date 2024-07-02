import Footer from '@/components/footer/footer';
import Header from '@/components/header/header';
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
      <Stack marginBlock="xl" />
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

export default Layout;
