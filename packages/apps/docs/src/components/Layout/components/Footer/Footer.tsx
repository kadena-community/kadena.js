import { IconButton, SystemIcon } from '@kadena/react-ui';

import { Spacer } from '../styles';
import { DocsLogo } from '..';

import { FooterLink } from './FooterLink';
import { FooterText } from './FooterText';
import { Box, InnerFooterWrapper, StyledFooter } from './styles';

import Link from 'next/link';
import React, { FC } from 'react';

export const Footer: FC = () => {
  return (
    <StyledFooter>
      <InnerFooterWrapper>
        <Box justifyContent="space-around" alignItems="center">
          <DocsLogo />
          <IconButton
            title="Go to our Github"
            icon={SystemIcon.Github}
            as="a"
            href="https://github.com/kadena-community"
          />
          <IconButton
            title="Go to our Twitter"
            icon={SystemIcon.Twitter}
            as="a"
            href="https://twitter.com/kadena_io"
          />
          <IconButton
            as="a"
            href="https://www.linkedin.com/company/kadena-llc"
            title="Go to our Linkedin"
            icon={SystemIcon.Linkedin}
          />
        </Box>
        <Spacer />
        <Box justifyContent="space-around" alignItems="center">
          <FooterLink href="https://kadena.io">Kadena.io</FooterLink>
          <FooterLink href="https://kadena.io">Privacy Policy</FooterLink>
          <FooterLink href="https://kadena.io">Terms of Service</FooterLink>
          <Link href="/docs/kadena/code-of-conduct" passHref legacyBehavior>
            <FooterLink>Code of Conduct</FooterLink>
          </Link>
        </Box>
        <Box justifyContent="space-around" alignItems="center">
          <FooterText>Copyrights 2023 © Kadena LLC</FooterText>
        </Box>
      </InnerFooterWrapper>
    </StyledFooter>
  );
};
