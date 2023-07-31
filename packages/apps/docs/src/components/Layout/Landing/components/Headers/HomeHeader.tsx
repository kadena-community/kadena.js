import { GradientText, Grid, Heading, Stack } from '@kadena/react-ui';

import { mostPopularWrapper } from './style.css';
import { StyledHeader, SubHeader, Wrapper } from './styles';

import { MostPopular } from '@/components/MostPopular';
import { IMostPopularPage } from '@/types/MostPopularData';
import React, { FC } from 'react';

interface IProps {
  popularPages: IMostPopularPage[];
}

export const HomeHeader: FC<IProps> = ({ popularPages }) => {
  return (
    <StyledHeader>
      <Wrapper>
        <Heading as="h1" variant="h2">
          Kadena
        </Heading>
        <Grid.Root
          columns={{
            lg: 2,
            md: 2,
            sm: 1,
          }}
          spacing="xl"
        >
          <Grid.Item>
            <Stack direction="column" spacing="$2xs">
              <Heading as="h2" variant="h4">
                Build your <GradientText>own</GradientText> Internet
              </Heading>
              <SubHeader>
                Explore our guides and examples to build on Kadena
              </SubHeader>
            </Stack>
          </Grid.Item>
          {popularPages.length > 0 && (
            <Grid.Item>
              <div className={mostPopularWrapper}>
                <MostPopular pages={popularPages} title="Most viewed docs" />
              </div>
            </Grid.Item>
          )}
        </Grid.Root>
      </Wrapper>
    </StyledHeader>
  );
};
