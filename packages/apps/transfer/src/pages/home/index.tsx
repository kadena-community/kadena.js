import {
  StyledHomeButton,
  StyledHomeContainer,
  StyledHomeContent,
  StyledHomeContentContainer,
  StyledHomeLink,
  StyledHomeTitle,
  StyledIconBox,
  StyledLinkText,
  StyledSmallLogo,
} from './styles';

import { Account, Chain, Key } from '@/resources/svg/generated';
import { downloadKeyPairToBrowser } from '@/services/key-pairs/key-pairs';
import React, { FC } from 'react';

const Home: FC = () => {
  const transferMenu = [
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
      title: 'Module explorer',
      href: '/module-explorer',
    },
  ];

  const faucetMenu = [
    {
      icon: Account,
      title: 'Existing account',
      href: '/',
    },
    {
      icon: Chain,
      title: 'New account',
      href: '/',
    },
  ];

  return (
    <StyledHomeContainer>
      <StyledSmallLogo width="65px" />
      <StyledHomeContentContainer>
        <StyledHomeContent>
          <StyledHomeTitle>Kadena Transfer</StyledHomeTitle>
          <StyledHomeButton onClick={downloadKeyPairToBrowser}>
            <StyledIconBox>
              <Key width="40px" height="40px" />
            </StyledIconBox>
            <StyledLinkText>Generate KeyPair (save to file)</StyledLinkText>
          </StyledHomeButton>
          {transferMenu.map((item) => (
            <StyledHomeLink key={`item-${item.title}`} href={item.href}>
              <StyledIconBox>
                <item.icon width="40px" height="40px" />
              </StyledIconBox>
              <StyledLinkText>{item.title}</StyledLinkText>
            </StyledHomeLink>
          ))}
        </StyledHomeContent>
        <StyledHomeContent>
          <StyledHomeTitle>Kadena Testnet Faucet</StyledHomeTitle>
          {faucetMenu.map((item) => (
            <StyledHomeLink key={`item-${item.title}`} href={item.href}>
              <StyledIconBox>
                <item.icon width="40px" height="40px" />
              </StyledIconBox>
              <StyledLinkText>{item.title}</StyledLinkText>
            </StyledHomeLink>
          ))}
        </StyledHomeContent>
      </StyledHomeContentContainer>
    </StyledHomeContainer>
  );
};

export default Home;
