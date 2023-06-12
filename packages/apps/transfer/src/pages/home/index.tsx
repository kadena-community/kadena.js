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

import routes from '@/constants/routes';
import { Account, Chain, Key } from '@/resources/svg/generated';
import { downloadKeyPairToBrowser } from '@/services/key-pairs/key-pairs';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';

const Home: FC = () => {
  const { t } = useTranslation('common');

  const transferMenu = [
    {
      icon: Account,
      title: t('Check account balance'),
      href: routes.CHECK_BALANCE,
    },
    {
      icon: Chain,
      title: t('Transfer'),
      href: routes.COIN_TRANSFER,
    },
    {
      icon: Chain,
      title: t('Module explorer'),
      href: routes.MODULE_EXPLORER,
    },
  ];

  const faucetMenu = [
    {
      icon: Account,
      title: t('Existing account'),
      href: routes.HOME,
    },
    {
      icon: Chain,
      title: t('New account'),
      href: routes.HOME,
    },
  ];

  return (
    <StyledHomeContainer>
      <StyledSmallLogo width="65px" />
      <StyledHomeContentContainer>
        <StyledHomeContent>
          <StyledHomeTitle>{t('Kadena Transfer')}</StyledHomeTitle>
          <StyledHomeButton onClick={downloadKeyPairToBrowser}>
            <StyledIconBox>
              <Key width="40px" height="40px" />
            </StyledIconBox>
            <StyledLinkText>
              {t('Generate KeyPair (save to file)')}
            </StyledLinkText>
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
          <StyledHomeTitle>{t('Kadena Testnet Faucet')}</StyledHomeTitle>
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
