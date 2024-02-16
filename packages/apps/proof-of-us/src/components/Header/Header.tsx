import Link from 'next/link';
import type { FC } from 'react';
import { AccountInfo } from '../AccountInfo/AccountInfo';
import { CookieConsent } from '../CookieConsent/CookieConsent';
import { WrapperClass, headerClass, logoWrapperClass } from './style.css';

export const Header: FC = () => {
  return (
    <>
      <header className={headerClass}>
        <div className={WrapperClass}>
          <div className={logoWrapperClass}>
            <Link href="/user">Proof....</Link>
          </div>
          <AccountInfo />
        </div>
      </header>
      <CookieConsent />
    </>
  );
};
