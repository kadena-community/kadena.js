import { IconButton, Stack, SystemIcon } from '@kadena/react-ui';

import { DocsLogo } from '..';

import { FooterLink } from './FooterLink';
import { FooterText } from './FooterText';
import { footerClass, footerWrapperClass, spacerClass } from './styles.css';

import Link from 'next/link';
import React, { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className={footerWrapperClass}>
      <div className={footerClass}>
        <Stack justifyContent="space-around" alignItems="center" marginY="$2">
          <DocsLogo />
          <IconButton
            title="Go to our Github"
            icon={SystemIcon.Github}
            onClick={() => alert('todo, make an href')}
          />
          <IconButton
            title="Go to our Twitter"
            icon={SystemIcon.Twitter}
            onClick={() => alert('todo, make an href')}
          />
          <IconButton
            onClick={() => alert('todo, make an href')}
            title="Go to our Linkedin"
            icon={SystemIcon.Linkedin}
          />
        </Stack>
        <div className={spacerClass} />
        <Stack justifyContent="space-around" alignItems="center" marginY="$2">
          <FooterLink href="https://kadena.io">Kadena.io</FooterLink>
          <FooterLink href="https://kadena.io">Privacy Policy</FooterLink>
          <FooterLink href="https://kadena.io">Terms of Service</FooterLink>
          <Link href="/docs/kadena/code-of-conduct" passHref legacyBehavior>
            <FooterLink>Code of Conduct</FooterLink>
          </Link>
        </Stack>
        <Stack justifyContent="space-around" alignItems="center" marginY="$2">
          <FooterText>Copyrights 2023 © Kadena LLC</FooterText>
        </Stack>
      </div>
    </footer>
  );
};
