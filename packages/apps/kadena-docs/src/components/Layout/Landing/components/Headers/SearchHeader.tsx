import { GradientText, Heading, Stack } from '@kadena/react-components';

import { StyledHeader, SubHeader, Wrapper } from './styles';

import { LinkList } from '@/components/LinkList';
import { ITopDoc } from '@/data/getTopDocs';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {}

export const SearchHeader: FC<IProps> = () => {
  return (
    <StyledHeader>
      <Wrapper>
        <Heading as="h1" variant="h2">
          Search spaces
        </Heading>
        <Stack spacing="2xl">
          <Stack direction="column" spacing="2xs">
            <Heading as="h2" variant="h4">
              Traditional or the <GradientText>new</GradientText> way
            </Heading>
            <SubHeader>Explore our content across spaces</SubHeader>
          </Stack>
        </Stack>
      </Wrapper>
    </StyledHeader>
  );
};
