import { Box, GradientText, Heading, Stack } from '@kadena/react-ui';

import {
  headerClass,
  mostPopularWrapper,
  subheaderClass,
  wrapperClass,
} from './style.css';

import { MostPopular } from '@/components/MostPopular';
import { SearchBar } from '@/components/SearchBar';
import type { IMostPopularPage } from '@/types/MostPopularData';
import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { useRouter } from 'next/router';
import type { FC, KeyboardEvent } from 'react';
import React from 'react';

interface IProps {
  popularPages: IMostPopularPage[];
}

export const HomeHeader: FC<IProps> = ({ popularPages }) => {
  const router = useRouter();

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    console.log(232342434);
    const value = e.currentTarget.value;
    if (e.key === 'Enter') {
      analyticsEvent(EVENT_NAMES['click:mobile_search'], {
        query: value,
      });
      console.log(323444444);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/search?q=${value}`);
      e.currentTarget.value = '';
    }
  };

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

            <Box marginTop="$5" marginRight="$40">
              <SearchBar onKeyUp={handleKeyPress} />
            </Box>
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
