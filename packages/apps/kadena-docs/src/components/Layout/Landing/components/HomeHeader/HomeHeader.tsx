import { Heading, Stack } from '@kadena/react-components';

import { StyledBackground, StyledHeader, Wrapper } from './styles';

import React, { FC } from 'react';

export const HomeHeader: FC = () => {
  return (
    <StyledHeader>
      <StyledBackground />
      <Wrapper>
        <Stack direction="column">
          <Heading as="h1" variant="h2">
            Kadena
          </Heading>
          <Heading as="h2" variant="h4">
            Build your own Internet
          </Heading>
        </Stack>
      </Wrapper>
    </StyledHeader>
  );
};
