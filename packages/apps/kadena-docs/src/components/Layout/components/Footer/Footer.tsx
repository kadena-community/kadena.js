import { IconButton, SystemIcons } from '@kadena/react-components';

import { Spacer } from '../styles';
import { DocsLogo } from '..';

import { FooterLink } from './FooterLink';
import { FooterText } from './FooterText';
import { Box, InnerFooterWrapper, StyledFooter } from './styles';

import React, { FC } from 'react';

export const Footer: FC = () => {
  return (
    <StyledFooter>
      <InnerFooterWrapper>
        <Box>
          <DocsLogo />
          <IconButton
            title="Go to our Github"
            icon={SystemIcons.Github}
            onClick={() => alert('todo, make an href')}
          />
          <IconButton
            title="Go to our Twitter"
            icon={SystemIcons.Twitter}
            onClick={() => alert('todo, make an href')}
          />
          <IconButton
            onClick={() => alert('todo, make an href')}
            title="Go to our Linkedin"
            icon={SystemIcons.Linkedin}
          />
        </Box>
        <Spacer />
        <Box>
          <FooterLink href="https://kadena.io">Kadena.io</FooterLink>
          <FooterLink href="https://kadena.io">Privacy Policy</FooterLink>
          <FooterLink href="https://kadena.io">Terms of Service</FooterLink>
        </Box>
        <Box>
          <FooterText>Copyrights 2023 © Kadena LLC</FooterText>
        </Box>
      </InnerFooterWrapper>
    </StyledFooter>
  );
};
