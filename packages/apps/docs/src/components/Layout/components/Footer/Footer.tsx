import { IconButton, Stack } from '@kadena/react-ui';

import { spacerClass } from '../styles.css';
import { DocsLogo } from '..';

import { FooterLink } from './FooterLink';
import { FooterText } from './FooterText';
import { footerClass, footerWrapperClass } from './styles.css';

import Link from 'next/link';
import React, { type FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className={footerWrapperClass}>
      <div className={footerClass}>
        <Stack justifyContent="space-around" alignItems="center" marginY="$2">
          <DocsLogo />
          <IconButton
            title="Go to our Github"
            icon="Github"
            as="a"
            href="https://github.com/kadena-community"
          />
          <IconButton
            title="Go to our Twitter"
            icon="Twitter"
            as="a"
            href="https://twitter.com/kadena_io"
          />
          <IconButton
            as="a"
            href="https://www.linkedin.com/company/kadena-llc"
            title="Go to our Linkedin"
            icon="Linkedin"
          />
        </Stack>
        <div className={spacerClass} />
        <Stack justifyContent="space-around" alignItems="center" marginY="$2">
          <FooterLink href="https://kadena.io">Kadena.io</FooterLink>
          <FooterLink href="https://kadena.io">Privacy Policy</FooterLink>
          <FooterLink href="https://kadena.io">Terms of Service</FooterLink>
          <Link href="/docs/kadena/code-of-conduct" passHref legacyBehavior>
            <FooterLink href="/docs/kadena/code-of-conduct">
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
