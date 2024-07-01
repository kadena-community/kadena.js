import Footer from '@/components/footer/footer';
import Header from '@/components/header/header';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { documentStyle, layoutWrapperClass } from './styles.css';

interface IProps {
  children?: ReactNode;
}

export const Layout: FC<IProps> = ({ children }: IProps) => {
  return (
    <div className={documentStyle}>
      <Header />

      <main className={layoutWrapperClass}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
