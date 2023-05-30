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
import React, { type ReactNode, FC } from 'react';

interface IProps {
  children?: ReactNode;
  title: string;
}

export const MainLayout: FC<IProps> = ({ children, title }: IProps) => (
  <StyledMainLayout>
    <StyledHeaderContainer>
      <StyledHeaderLogoWalletContent>
        <StyledLogoTextContainer>
          <KLogoComponent width="100px" />
          <StyledHeaderText>
            <StyledTextBold>K:Transfer</StyledTextBold>
            <StyledTextNormal>Kadena Testnet</StyledTextNormal>
          </StyledHeaderText>
        </StyledLogoTextContainer>
        <StyledWalletNotConnected>
          <p>Connect your wallet</p>
          <StyledIconImage width={'40px'} height={'40px'} />
        </StyledWalletNotConnected>
      </StyledHeaderLogoWalletContent>

      <StyledTitleContainer>
        <StyledBack href={'/'}>
          <StyledChevronLeft width={'20px'} height={'20px'} />
          <span>Back</span>
        </StyledBack>
        <StyledTitle>{title}</StyledTitle>
      </StyledTitleContainer>
    </StyledHeaderContainer>
    {children}
  </StyledMainLayout>
);

export default MainLayout;
