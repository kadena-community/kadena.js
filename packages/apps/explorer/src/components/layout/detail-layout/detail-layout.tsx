import type { FC, ReactNode } from 'react';
import React from 'react';
import { NavBar } from './../../navbar/navbar';
import { documentStyle, layoutWrapperClass } from './../styles.css';

interface IProps {
  children?: ReactNode;
}

export const DetailLayout: FC<IProps> = ({ children }: IProps) => {
  return (
    <div className={documentStyle}>
      <NavBar />
      <main className={layoutWrapperClass}>{children}</main>
    </div>
  );
};

export default DetailLayout;
