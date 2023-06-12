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
  StyledTextNormal,
  StyledTitle,
  StyledTitleContainer,
  StyledWalletNotConnected,
} from './styles';

import { KLogoComponent } from '@/resources/svg/generated';
import useTranslation from 'next-translate/useTranslation';
import React, { type ReactNode, FC } from 'react';

interface IProps {
  children?: ReactNode;
  title: string;
}

export const MainLayout: FC<IProps> = ({ children, title }: IProps) => {
  const { t } = useTranslation('common');

  return (
    <StyledMainLayout>
      <StyledHeaderContainer>
        <StyledHeaderLogoWalletContent>
          <StyledLogoTextContainer>
            <KLogoComponent width="100px" />
            <StyledHeaderText>
              <StyledTextBold>{t('K:Transfer')}</StyledTextBold>
              <StyledTextNormal>{t('Kadena Testnet')}</StyledTextNormal>
            </StyledHeaderText>
          </StyledLogoTextContainer>
          <StyledWalletNotConnected>
            <p>{t('Connect your wallet')}</p>
            <StyledIconImage width={'40px'} height={'40px'} />
          </StyledWalletNotConnected>
        </StyledHeaderLogoWalletContent>

        <StyledTitleContainer>
          <StyledBack href={'/'}>
            <StyledChevronLeft width={'20px'} height={'20px'} />
            <span>{t('Back')}</span>
          </StyledBack>
          <StyledTitle>{title}</StyledTitle>
        </StyledTitleContainer>
      </StyledHeaderContainer>
      {children}
    </StyledMainLayout>
  );
};

export default MainLayout;
