import { GradientText, Heading, Stack } from '@kadena/react-components';

import { StyledHeader, SubHeader, Wrapper } from './styles';

import { LinkList } from '@/components/LinkList';
import Link from 'next/link';
import React, { FC } from 'react';

export const HomeHeader: FC = () => {
  return (
    <StyledHeader>
      <Wrapper>
        <Heading as="h1" variant="h2">
          Kadena
        </Heading>
        <Stack spacing="2xl">
          <Stack direction="column" spacing="2xs">
            <Heading as="h2" variant="h4">
              Build your <GradientText>own</GradientText> Internet
            </Heading>
            <SubHeader>
              Explore our guides and examples to build on Kadena
            </SubHeader>
          </Stack>
          <div style={{ width: '150px' }}></div>
          <LinkList title="Most viewed docs">
            <Link href="/docs/pact">Pact language resources</Link>
            <Link href="/docs/pact">Whitepapers</Link>
            <Link href="/docs/pact">KadenaJS</Link>
            <Link href="/docs/pact">Quickstart</Link>
            <Link href="/docs/pact">Pact REST Api</Link>
          </LinkList>
        </Stack>
      </Wrapper>
    </StyledHeader>
  );
};
