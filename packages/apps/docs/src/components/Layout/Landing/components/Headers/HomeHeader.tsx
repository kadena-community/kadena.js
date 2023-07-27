import { Stack } from '@kadena/react-components';
import { GradientText, Heading } from '@kadena/react-ui';

import { mostPopularWrapper } from './style.css';
import { StyledHeader, StyledStack, SubHeader, Wrapper } from './styles';

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
        <StyledStack spacing="2xl" flexWrap="wrap">
          <Stack direction="column" spacing="2xs">
            <Heading as="h2" variant="h4">
              Build your <GradientText>own</GradientText> Internet
            </Heading>
            <SubHeader>
              Explore our guides and examples to build on Kadena
            </SubHeader>
          </Stack>
          {popularPages.length > 0 && (
            <div className={mostPopularWrapper}>
              <MostPopular pages={popularPages} title="Most viewed docs" />
            </div>
          )}
        </StyledStack>
      </Wrapper>
    </StyledHeader>
  );
};
