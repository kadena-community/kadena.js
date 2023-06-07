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
import React, { FC } from 'react';

const Home: FC = () => {
  const menu = [
    {
      icon: Chain,
      title: 'Cross-chain Transfer Tracker',
      href: '/cross-chain-transfer-tracker',
    },
    {
      icon: Chain,
      title: 'Cross-chain Transfer Finisher',
      href: '/cross-chain-transfer-finisher',
    },
    {
      icon: Chain,
      title: 'Module explorer',
      href: '/code-viewer',
    },
  ];

  return (
    <StyledHomeContainer>
      <StyledSmallLogo width="65px" />
      <StyledHomeContent>
        <StyledHomeTitle>Kadena Cross Chain Transfers</StyledHomeTitle>

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
