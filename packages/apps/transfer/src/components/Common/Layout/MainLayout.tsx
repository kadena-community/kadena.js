import {
  StyledBack,
  StyledChevronLeft,
  StyledHeaderContainer,
  StyledHeaderLogoWalletContent,
  StyledHeaderText,
  StyledIconImage,
  StyledLogoTextContainer,
  StyledMainLayout,
  StyledTextBold,
  StyledTitle,
  StyledTitleContainer,
  StyledWalletNotConnected,
} from './styles';

import { Select } from '@/components/Global';
import { StyledOption } from '@/components/Global/Select/styles';
import routes from '@/constants/routes';
import { Network, useAppContext } from '@/context/app-context';
import { KLogoComponent } from '@/resources/svg/generated';
import useTranslation from 'next-translate/useTranslation';
import React, { type ReactNode, FC } from 'react';

interface IProps {
  children?: ReactNode;
  title: string;
}

export const MainLayout: FC<IProps> = ({ children, title }: IProps) => {
  const { network, setNetwork } = useAppContext();
  const { t } = useTranslation('common');

  return (
    <StyledMainLayout>
      <StyledHeaderContainer>
        <StyledHeaderLogoWalletContent data-testid="content">
          <StyledLogoTextContainer>
            <KLogoComponent width="100px" />
            <StyledHeaderText>
              <StyledTextBold>{t('K:Transfer')}</StyledTextBold>
              <Select
                leadingText={t('Network')}
                onChange={(e) => setNetwork(e.target.value as Network)}
                value={network}
              >
                <StyledOption value="Mainnet">{t('Mainnet')}</StyledOption>
                <StyledOption value="Testnet">{t('Testnet')}</StyledOption>
              </Select>
            </StyledHeaderText>
          </StyledLogoTextContainer>
          <StyledWalletNotConnected>
            <p>{t('Connect your wallet')}</p>
            <StyledIconImage width={'40px'} height={'40px'} />
          </StyledWalletNotConnected>
        </StyledHeaderLogoWalletContent>

        <StyledTitleContainer>
          <StyledBack href={routes.HOME}>
            <StyledChevronLeft width={'20px'} height={'20px'} />
            <span data-testid="back-button">{t('Back')}</span>
          </StyledBack>
          <StyledTitle data-testid="title">{title}</StyledTitle>
        </StyledTitleContainer>
      </StyledHeaderContainer>
      {children}
    </StyledMainLayout>
  );
};

export default MainLayout;
