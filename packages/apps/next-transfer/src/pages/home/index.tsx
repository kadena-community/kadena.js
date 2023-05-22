import {
  StyledHomeContainer,
  StyledHomeContent,
  StyledHomeLink,
  StyledHomeTitle,
  StyledIconBox,
  StyledLinkText,
  StyledSmallLogo,
} from './styles';

import { Account, Chain, Key } from '@/resources/svg/generated';
import React, { FC } from 'react';

const Home: FC = () => {
  const menu = [
    {
      icon: Key,
      title: 'Generate KeyPair (save to file)',
      href: '/check-balance',
    },
    {
      icon: Account,
      title: 'Check account balance',
      href: '/check-balance',
    },
    {
      icon: Chain,
      title: 'Transfer',
      href: '/check-balance',
    },
    {
      icon: Chain,
      title: 'Transfer With Ledger',
      href: '/check-balance',
    },
    {
      icon: Chain,
      title: 'Finish CrossChain Transfer',
      href: '/check-balance',
    },
  ];
  return (
    <StyledHomeContainer>
      <StyledSmallLogo width={'65px'} />
      <StyledHomeContent>
        <StyledHomeTitle>Kadena Transfer</StyledHomeTitle>
        {menu.map((item) => (
          <StyledHomeLink key={`item-${item.title}`} href={item.href}>
            <StyledIconBox>
              <item.icon width="40px" height={'40px'} />
            </StyledIconBox>
            <StyledLinkText>{item.title}</StyledLinkText>
          </StyledHomeLink>
        ))}
      </StyledHomeContent>
    </StyledHomeContainer>
  );
};

export default Home;
