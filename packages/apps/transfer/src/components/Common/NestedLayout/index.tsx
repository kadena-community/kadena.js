import {
  StyledBackButton,
  StyledBody,
  StyledBodyContainer,
  StyledBodyTitle,
  StyledContainer,
  StyledHeader,
  StyledHeaderTitle,
  StyledNav,
  StyledNavItem,
} from './styles';

import Image from 'next/image';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
}

export const NestedLayout: FC<IProps> = (props) => {
  const { children } = props;
  return (
    <StyledContainer className="p-6">
      <StyledHeader className="flex justify-between">
        <Image src="" alt="Kadena logo" />
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
                New Account
              </StyledNavItem>
            </li>
            <li>
              <StyledNavItem href="/faucet/existing" last>
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
