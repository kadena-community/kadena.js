import { Stack } from '@kadena/react-ui';

import { DocsLogo } from '../DocsLogo/DocsLogo';
import { spacerClass } from '../styles.css';

import { FooterLink } from './FooterLink';
import { FooterText } from './FooterText';
import { footerClass, footerWrapperClass } from './styles.css';

import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

export const Footer: FC = () => {
  return (
    <footer className={footerWrapperClass}>
      <div className={footerClass}>
        <Stack justifyContent="space-around" alignItems="center" marginY="$2">
          <DocsLogo overwriteTheme="dark" />
        </Stack>
        <div className={spacerClass} />
        <Stack justifyContent="space-around" alignItems="center" marginY="$2">
          <FooterLink href="https://kadena.io">Kadena.io</FooterLink>
          <FooterLink href="https://kadena.io">Privacy Policy</FooterLink>
          <FooterLink href="https://kadena.io">Terms of Service</FooterLink>
          <Link href="/kadena/code-of-conduct" passHref legacyBehavior>
            <FooterLink href="/kadena/code-of-conduct">
              Code of Conduct
            </FooterLink>
          </Link>
        </Stack>
        <Stack justifyContent="space-around" alignItems="center" marginY="$2">
          <FooterText>Copyrights 2023 © Kadena LLC</FooterText>
        </Stack>
      </div>
    </footer>
  );
};
