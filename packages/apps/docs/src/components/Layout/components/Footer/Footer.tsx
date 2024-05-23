import { Stack } from '@kadena/react-ui';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { DocsLogo } from '../DocsLogo/DocsLogo';
import { spacerClass } from '../styles.css';
import { FooterLink } from './FooterLink';
import { FooterText } from './FooterText';
import { footerClass, footerWrapperClass, logoClass } from './styles.css';

export const Footer: FC = () => {
  return (
    <footer className={footerWrapperClass}>
      <div className={footerClass}>
        <Stack
          justifyContent="space-around"
          alignItems="center"
          className={logoClass}
          marginBlock="sm"
        >
          <DocsLogo />
        </Stack>
        <div className={spacerClass} />
        <Stack
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-around"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          marginBlock="sm"
        >
          <FooterLink href="https://kadena.io">Kadena.io</FooterLink>
          <FooterLink href="https://kadena.io/privacy-policy">
            Privacy Policy
          </FooterLink>
          <FooterLink href="https://www.kadena.io/terms-and-conditions">
            Terms and Conditions
          </FooterLink>
          <Link
            href="https://www.kadena.io/community-guidelines"
            passHref
            legacyBehavior
          >
            <FooterLink href="/kadena/code-of-conduct">
              Code of Conduct
            </FooterLink>
          </Link>
        </Stack>
        <Stack
          justifyContent="space-around"
          alignItems="center"
          marginBlock="sm"
        >
          <FooterText>Copyrights 2023 © Kadena LLC</FooterText>
        </Stack>
      </div>
    </footer>
  );
};
