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
        <StyledHeaderLogoWalletContent>
          <StyledLogoTextContainer>
            <KLogoComponent width="100px" />
            <StyledHeaderText>
              <StyledTextBold>K:Transfer</StyledTextBold>
              <Select
                leadingText="Network"
                onChange={(e) => setNetwork(e.target.value as Network)}
                value={network}
              >
                <StyledOption value="Mainnet">Mainnet</StyledOption>
                <StyledOption value="Testnet">Testnet</StyledOption>
              </Select>
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
};

export default MainLayout;
