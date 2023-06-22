import { Grid } from '@kadena/react-components';

import {
  StyledBack,
  StyledChevronLeft,
  StyledFooter,
  StyledIconImage,
  StyledMainContent,
  StyledMainLayout,
  StyledTextBold,
  StyledTitle,
  StyledWalletNotConnected,
} from './styles';

import { Select, SidebarMenu } from '@/components/Global';
import { StyledOption } from '@/components/Global/Select/styles';
import routes from '@/constants/routes';
import { Network, useAppContext } from '@/context/app-context';
import { KLogoComponent } from '@/resources/svg/generated';
import useTranslation from 'next-translate/useTranslation';
import React, { type ReactNode, FC } from 'react';

interface IProps {
  children?: ReactNode;
  footer?: ReactNode;
  title: string;
}

export const MainLayout: FC<IProps> = ({ children, title, footer }: IProps) => {
  const { network, setNetwork } = useAppContext();
  const { t } = useTranslation('common');

  return (
    <StyledMainLayout>
      <Grid.Container>
        <Grid.Item colStart={1} colEnd={5}>
          <Grid.Container spacing="xl">
            <Grid.Item colStart={1} colEnd={5}>
              <KLogoComponent width="100%" />
            </Grid.Item>
            <Grid.Item colStart={5} colEnd={11}>
              <StyledTextBold>{t('K:Transfer')}</StyledTextBold>
              <Select
                leadingText={t('Network')}
                onChange={(e) => setNetwork(e.target.value as Network)}
                value={network}
              >
                <StyledOption value="Mainnet">{t('Mainnet')}</StyledOption>
                <StyledOption value="Testnet">{t('Testnet')}</StyledOption>
              </Select>
            </Grid.Item>
          </Grid.Container>
        </Grid.Item>
        <Grid.Item colStart={10} colEnd={13}>
          <StyledWalletNotConnected>
            <p>{t('Connect your wallet')}</p>
            <StyledIconImage width={'40px'} height={'40px'} />
          </StyledWalletNotConnected>
        </Grid.Item>
      </Grid.Container>

      <Grid.Container spacing="3xl">
        <Grid.Item colStart={1} colEnd={5}>
          <StyledBack href={routes.HOME}>
            <StyledChevronLeft width={'20px'} height={'20px'} />
            <span data-testid="back-button">{t('Back')}</span>
          </StyledBack>
        </Grid.Item>
        <Grid.Item colStart={5} colEnd={13}>
          <StyledTitle data-testid="title">{title}</StyledTitle>
        </Grid.Item>
      </Grid.Container>
      <Grid.Container spacing="3xl">
        <Grid.Item colStart={1} colEnd={5}>
          <SidebarMenu />
        </Grid.Item>
        <Grid.Item colStart={5} colEnd={13}>
          <StyledMainContent data-testid="content">
            {children}
          </StyledMainContent>
        </Grid.Item>
      </Grid.Container>
      {!!footer && <StyledFooter>{footer}</StyledFooter>}
    </StyledMainLayout>
  );
};

export default MainLayout;
