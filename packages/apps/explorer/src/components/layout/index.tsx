import Head from 'next/head';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { NavBar } from './navbar/navbar';
import { documentStyle, layoutWrapperClass } from './styles.css';

interface IProps {
  children?: ReactNode;
}

const appName = 'Kadena Graph Client';

export const Layout: FC<IProps> = ({ children }: IProps) => {
  return (
    <div className={documentStyle}>
      <Head>
        <title>{appName}</title>
        <link
          rel="icon"
          href="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/icons/internal/default/icon%40128.png"
        />
      </Head>

      <NavBar />
      <main className={layoutWrapperClass}>{children}</main>
    </div>
  );
};

export default Layout;
