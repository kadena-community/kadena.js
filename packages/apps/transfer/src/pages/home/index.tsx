import {
  StyledHomeContainer,
  StyledHomeContent,
  StyledHomeLink,
  StyledHomeTitle,
  StyledIconBox,
  StyledLinkText,
  StyledSmallLogo,
} from './styles';

import { Chain } from '@/resources/svg/generated';
import React, { FC } from 'react';

const Home: FC = () => {
  const menu = [
    {
      icon: Chain,
      title: 'Cross Chain Transfer Tracker',
      href: '/cross-chain-transfer-tracker',
    },
    {
      icon: Chain,
      title: 'Cross Chain Transfer Finisher',
      href: '/cross-chain-transfer-finisher',
    },
    {
      icon: Chain,
      title: 'Module Explorer',
      href: '/module-explorer',
    },
  ];

  return (
    <StyledHomeContainer>
      <StyledSmallLogo width="65px" />
      <StyledHomeContent>
        <StyledHomeTitle>Cross Chain Transfers</StyledHomeTitle>

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
