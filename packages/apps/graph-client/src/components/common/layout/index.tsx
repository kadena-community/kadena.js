import Head from 'next/head';
import type { FC, ReactNode } from 'react';
import React from 'react';
import Header from './header/header';
import { documentStyle } from './styles.css';

interface IProps {
  children?: ReactNode;
  omitHeader?: boolean;
}

const appName = 'Kadena Graph Client';

export const Layout: FC<IProps> = ({ children, omitHeader }: IProps) => {
  return (
    <div className={documentStyle}>
      <Head>
        <title>{appName}</title>
        <link
          rel="icon"
          href="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/icons/internal/default/icon%40128.png"
        />
      </Head>

      {!omitHeader && <Header title={appName} />}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
