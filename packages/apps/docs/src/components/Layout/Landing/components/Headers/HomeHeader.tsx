import { Box, GradientText, Grid, Heading, Stack } from '@kadena/react-ui';

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
    const value = e.currentTarget.value;
    if (e.key === 'Enter') {
      analyticsEvent(EVENT_NAMES['click:mobile_search'], {
        query: value,
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/search?q=${value}`);
      e.currentTarget.value = '';
    }
  };

  return (
    <header className={headerClass}>
      <div className={wrapperClass}>
        <Grid.Root columns={{ sm: 1, md: 2 }}>
          <Grid.Item>
            <Heading as="h1" variant="h2">
              Kadena
            </Heading>
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
          </Grid.Item>
          <Grid.Item>
            {popularPages.length > 0 && (
              <Box
                paddingLeft={{ sm: '$1', lg: '$15', xl: '$32', xxl: '$48' }}
                marginRight="$10"
              >
                <MostPopular pages={popularPages} title="Most viewed docs" />
              </Box>
            )}
          </Grid.Item>
        </Grid.Root>
      </div>
    </header>
  );
};
