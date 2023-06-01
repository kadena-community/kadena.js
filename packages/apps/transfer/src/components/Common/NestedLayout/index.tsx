import {
  StyledBackButton,
  StyledBody,
  StyledBodyContainer,
  StyledBodyTitle,
  StyledBottomNavItem,
  StyledContainer,
  StyledHeader,
  StyledHeaderTitle,
  StyledNav,
  StyledTopNavItem,
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
      <StyledBodyContainer className="flex flex-row gap-x-10">
        <StyledNav className="basis-1/4">
          <StyledBackButton className="mb-12" />
          <ul>
            <li>
              <StyledTopNavItem href="/faucet/new" className="rounded-t">
                New Account
              </StyledTopNavItem>
            </li>
            <li>
              <StyledBottomNavItem
                href="/faucet/existing"
                className="rounded-b"
              >
                Existing Account
              </StyledBottomNavItem>
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
