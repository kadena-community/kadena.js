import {
  StyledAccount,
  StyledBackButton,
  StyledBody,
  StyledBodyContainer,
  StyledBodyTitle,
  StyledContainer,
  StyledHeader,
  StyledHeaderTitle,
  StyledLogoPlusColon,
  StyledNav,
  StyledNavItem,
} from './styles';

import { KLogoComponent } from '@/resources/svg/generated';
import React, { FC, ReactElement } from 'react';

interface IProps {
  children?: ReactElement;
}

export const NestedLayout: FC<IProps> = (props) => {
  const { children } = props;
  return (
    <StyledContainer>
      <StyledHeader>
        <KLogoComponent width={64} />
        <StyledHeaderTitle>
          <p>K:faucet</p>
          <p>Kadena Testnet Faucet (chain #1)</p>
        </StyledHeaderTitle>
        <a href="#">Connect your wallet</a>
      </StyledHeader>
      <StyledBodyContainer>
        <StyledNav>
          <StyledBackButton />
          <ul>
            <li>
              <StyledNavItem href="/faucet/new" first>
                <StyledLogoPlusColon width="14px" />
                New Account
              </StyledNavItem>
            </li>
            <li>
              <StyledNavItem href="/faucet/existing" last>
                <StyledAccount width="14px" />
                Existing Account
              </StyledNavItem>
            </li>
          </ul>
        </StyledNav>

        <StyledBody>
          <StyledBodyTitle>{children?.props.title}</StyledBodyTitle>
          {children}
        </StyledBody>
      </StyledBodyContainer>
    </StyledContainer>
  );
};
