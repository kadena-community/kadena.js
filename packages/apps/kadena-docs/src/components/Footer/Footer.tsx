import { styled } from '@kadena/react-components';

import { InnerWrapper } from '../Header/styles';

import { FooterLink } from './FooterLink';
import { FooterText } from './FooterText';

import React, { FC } from 'react';

const StyledFooter = styled('footer', {
  position: 'relative',
  gridArea: 'footer',
  zIndex: '$menu',
  background: '$neutral2',
});

export const Footer: FC = () => {
  return (
    <StyledFooter>
      <InnerWrapper>
        <FooterLink href="https://kadena.io">Kadena.io</FooterLink>
        <FooterLink href="https://kadena.io">Privacy Policy</FooterLink>
        <FooterLink href="https://kadena.io">Terms of Service</FooterLink>
        <FooterText>Copyrights 2023 © Kadena LLC</FooterText>
      </InnerWrapper>
    </StyledFooter>
  );
};
