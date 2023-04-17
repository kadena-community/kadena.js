import { darkTheme, styled } from '@kadena/react-components';

import { InnerWrapper, Spacer } from '../styles';
import { DocsLogo } from '..';

import { FooterLink } from './FooterLink';
import { FooterText } from './FooterText';

import React, { FC } from 'react';

const StyledFooter = styled('footer', {
  position: 'relative',
  gridArea: 'footer',
  zIndex: '$menu',
  background: '$neutral2',

  [`.${darkTheme} &`]: {
    background: '$neutral3',
  },
});

export const Footer: FC = () => {
  return (
    <StyledFooter>
      <InnerWrapper>
        <DocsLogo />
        <Spacer />
        <FooterLink href="https://kadena.io">Kadena.io</FooterLink>
        <FooterLink href="https://kadena.io">Privacy Policy</FooterLink>
        <FooterLink href="https://kadena.io">Terms of Service</FooterLink>
        <FooterText>Copyrights 2023 © Kadena LLC</FooterText>
      </InnerWrapper>
    </StyledFooter>
  );
};
