import { Grid } from '@kadena/react-ui';

import {
  StyledBack,
  StyledChevronLeft,
  StyledFooter,
  StyledMainContent,
  StyledMainLayout,
  StyledTextBold,
  StyledTitle,
} from './styles';

import { Select, SidebarMenu } from '@/components/Global';
import { StyledOption } from '@/components/Global/Select/styles';
import { Network } from '@/constants/kadena';
import routes from '@/constants/routes';
import { useAppContext } from '@/context/app-context';
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
      <Grid.Root>
        <Grid.Item>
          <Grid.Root spacing="xl">
            <Grid.Item>
              <StyledTextBold>{t('K:Transfer')}</StyledTextBold>
              <Select
                leadingText={t('Network')}
                onChange={(e) => setNetwork(e.target.value as Network)}
                value={network}
              >
                <StyledOption value="MAINNET">{t('Mainnet')}</StyledOption>
                <StyledOption value="TESTNET">{t('Testnet')}</StyledOption>
              </Select>
            </Grid.Item>
          </Grid.Root>
        </Grid.Item>
      </Grid.Root>

      <Grid.Root spacing="3xl">
        <Grid.Item>
          <StyledBack href={routes.HOME}>
            <StyledChevronLeft width={'20px'} height={'20px'} />
            <span data-testid="back-button">{t('Back')}</span>
          </StyledBack>
        </Grid.Item>
        <Grid.Item>
          <StyledTitle data-testid="title">{title}</StyledTitle>
        </Grid.Item>
      </Grid.Root>
      <Grid.Root spacing="3xl">
        <Grid.Item>
          <SidebarMenu />
        </Grid.Item>
        <Grid.Item>
          <StyledMainContent data-testid="content">
            {children}
          </StyledMainContent>
        </Grid.Item>
      </Grid.Root>
      {Boolean(footer) && <StyledFooter>{footer}</StyledFooter>}
    </StyledMainLayout>
  );
};

export default MainLayout;
