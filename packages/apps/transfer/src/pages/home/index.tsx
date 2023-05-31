import {
  StyledHomeButton,
  StyledHomeContainer,
  StyledHomeContent,
  StyledHomeLink,
  StyledHomeTitle,
  StyledIconBox,
  StyledLinkText,
  StyledSmallLogo,
} from './styles';

import { Account, Chain, Key } from '@/resources/svg/generated';
import { downloadKeyPairToBrowser } from '@/services/key-pairs/key-pairs';
import { codeViewer } from '@/services/modules/code-viewer';
import React, { FC } from 'react';

const Home: FC = () => {
  const menu = [
    {
      icon: Account,
      title: 'Check account balance',
      href: '/check-balance',
    },
    {
      icon: Chain,
      title: 'Transfer',
      href: '/coin-transfer',
    },
    {
      icon: Chain,
      title: 'Code Explorer',
      href: '/code-viewer',
    },
  ];

  return (
    <StyledHomeContainer>
      <StyledSmallLogo width="65px" />
      <StyledHomeContent>
        <StyledHomeTitle>Kadena Transfer</StyledHomeTitle>
        <StyledHomeButton onClick={downloadKeyPairToBrowser}>
          <StyledIconBox>
            <Key width="40px" height="40px" />
          </StyledIconBox>
          <StyledLinkText>Generate KeyPair (save to file)</StyledLinkText>
        </StyledHomeButton>
        {menu.map((item) => (
          <StyledHomeLink key={`item-${item.title}`} href={item.href}>
            <StyledIconBox>
              <item.icon width="40px" height="40px" />
            </StyledIconBox>
            <StyledLinkText>{item.title}</StyledLinkText>
          </StyledHomeLink>
        ))}
      </StyledHomeContent>
    </StyledHomeContainer>
  );
};

export default Home;
