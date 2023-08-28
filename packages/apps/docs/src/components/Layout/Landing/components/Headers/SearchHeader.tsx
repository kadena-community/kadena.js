import { GradientText, Heading, Stack } from '@kadena/react-ui';

import { StyledHeader, SubHeader, Wrapper } from './styles';

import React, { FC, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export const SearchHeader: FC<IProps> = ({ children }) => {
  return (
    <StyledHeader>
      <Wrapper>
        <Heading as="h1" variant="h2">
          Search spaces
        </Heading>
        <Stack direction="column" gap="$2xs">
          <Heading as="h2" variant="h4">
            Traditional or the <GradientText>new</GradientText> way
          </Heading>
          <SubHeader>Explore our content across spaces</SubHeader>
          {children}
        </Stack>
      </Wrapper>
    </StyledHeader>
  );
};
