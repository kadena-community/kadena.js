import Head from 'next/head';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { mainStyle } from '../main/styles.css';
import Header from './Header/Header';

interface IProps {
  children?: ReactNode;
}

const appName = 'Kadena Graph Client';

export const Layout: FC<IProps> = ({ children }: IProps) => {
  return (
    <div>
      <Head>
        <title>{appName}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header title={appName} />
      <main className={mainStyle}>{children}</main>
    </div>
  );
};

export default Layout;
