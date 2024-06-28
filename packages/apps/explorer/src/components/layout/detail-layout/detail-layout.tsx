import Footer from '@/components/footer/footer';
import { NavBar } from '@/components/navbar/navbar';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { documentStyle, layoutWrapperClass } from './../styles.css';

interface IProps {
  children?: ReactNode;
}

export const DetailLayout: FC<IProps> = ({ children }: IProps) => {
  return (
    <div className={documentStyle}>
      <NavBar />
      <main className={layoutWrapperClass}>{children}</main>
      <Footer />
    </div>
  );
};

export default DetailLayout;
