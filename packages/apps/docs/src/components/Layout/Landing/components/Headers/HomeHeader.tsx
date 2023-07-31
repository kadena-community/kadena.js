import { GradientText, Heading, Stack } from '@kadena/react-ui';

import { StyledHeader, SubHeader, Wrapper } from './styles';

import { LinkList } from '@/components/LinkList';
import { ITopDoc } from '@/data/getTopDocs';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  topDocs: ITopDoc[];
}

export const HomeHeader: FC<IProps> = ({ topDocs }) => {
  return (
    <StyledHeader>
      <Wrapper>
        <Heading as="h1" variant="h2">
          Kadena
        </Heading>
        <Stack spacing="$2xl">
          <Stack direction="column" spacing="$2xs">
            <Heading as="h2" variant="h4">
              Build your <GradientText>own</GradientText> Internet
            </Heading>
            <SubHeader>
              Explore our guides and examples to build on Kadena
            </SubHeader>
          </Stack>
          <div style={{ width: '150px' }}></div>
          {topDocs?.length > 0 && (
            <LinkList title="Most viewed docs">
              {topDocs.map((item) => (
                <Link key={item.url} href={item.url}>
                  {item.label}
                </Link>
              ))}
            </LinkList>
          )}
        </Stack>
      </Wrapper>
    </StyledHeader>
  );
};
