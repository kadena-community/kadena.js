import { GradientText, Heading, Stack } from '@kadena/react-ui';

import {
  headerClass,
  mostPopularWrapper,
  subheaderClass,
  wrapperClass,
} from './style.css';

import { MostPopular } from '@/components/MostPopular';
import { type IMostPopularPage } from '@/types/MostPopularData';
import React, { type FC } from 'react';

interface IProps {
  popularPages: IMostPopularPage[];
}

export const HomeHeader: FC<IProps> = ({ popularPages }) => {
  return (
    <header className={headerClass}>
      <div className={wrapperClass}>
        <Heading as="h1" variant="h2">
          Kadena
        </Heading>
        <Stack gap="$2xl" wrap="wrap">
          <Stack direction="column" gap="$2xs">
            <Heading as="h2" variant="h4">
              Build your <GradientText>own</GradientText> Internet
            </Heading>
            <span className={subheaderClass}>
              Explore our guides and examples to build on Kadena
            </span>
          </Stack>
          {popularPages.length > 0 && (
            <div className={mostPopularWrapper}>
              <MostPopular pages={popularPages} title="Most viewed docs" />
            </div>
          )}
        </Stack>
      </div>
    </header>
  );
};
