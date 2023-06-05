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
import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
}

export const NestedLayout: FC<IProps> = (props) => {
  const { children } = props;
  return (
    <StyledContainer className="p-6">
      <StyledHeader className="flex justify-between">
        <KLogoComponent width={64} />
        <StyledHeaderTitle className="grow">
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

        <StyledBody className="basis-3/4">
          <StyledBodyTitle className="mb-12">
            {children.props.title}
          </StyledBodyTitle>
          {children}
        </StyledBody>
      </StyledBodyContainer>
    </StyledContainer>
  );
};
