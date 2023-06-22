import { Grid } from '@kadena/react-components';

import routes from '@/constants/routes';
import {
  StyledHomeContainer,
  StyledHomeContent,
  StyledHomeLink,
  StyledHomeTitle,
  StyledIconBox,
  StyledLinkText,
  StyledSmallLogo,
} from '@/pages/home/styles';
import { Account, Chain } from '@/resources/svg/generated';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';

const Home: FC = () => {
  const { t } = useTranslation('common');

  const transferMenu = [
    {
      icon: Chain,
      title: t('Cross Chain Transfer Tracker'),
      href: routes.CROSS_CHAIN_TRANSFER_TRACKER,
    },
    {
      icon: Chain,
      title: t('Cross Chain Transfer Finisher'),
      href: routes.CROSS_CHAIN_TRANSFER_FINISHER,
    },
    {
      icon: Account,
      title: t('Account Transactions'),
      href: routes.ACCOUNT_TRANSACTIONS,
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
      href: routes.FAUCET_EXISTING,
    },
    {
      icon: Chain,
      title: t('New account'),
      href: routes.FAUCET_NEW,
    },
  ];

  return (
    <StyledHomeContainer>
      <StyledSmallLogo width="65px" />
      <Grid.Container spacing="2xl" templateColumns="repeat(2, 1fr)">
        <Grid.Item>
          <StyledHomeContent>
            <StyledHomeTitle>{t('Cross Chain Transfers')}</StyledHomeTitle>
            {transferMenu.map((item) => (
              <StyledHomeLink key={`item-${item.title}`} href={item.href}>
                <StyledIconBox>
                  <item.icon width="40px" height="40px" />
                </StyledIconBox>
                <StyledLinkText>{item.title}</StyledLinkText>
              </StyledHomeLink>
            ))}
          </StyledHomeContent>
        </Grid.Item>
        <Grid.Item>
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
        </Grid.Item>
      </Grid.Container>
    </StyledHomeContainer>
  );
};

export default Home;
