import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import { Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { CookieConsent } from '../CookieConsent/CookieConsent';
import { contentClass, documentStyle, layoutWrapperClass } from './styles.css';

interface IProps {
  children?: ReactNode;
}

export const Layout: FC<IProps> = ({ children }: IProps) => {
  return (
    <div className={documentStyle}>
      <Header />
      <CookieConsent />
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
