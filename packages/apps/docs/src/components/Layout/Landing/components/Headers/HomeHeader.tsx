import type { IMostPopularPage } from '@/MostPopularData';
import MostPopular from '@/components/MostPopular/MostPopular';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import {
  Box,
  GradientText,
  Grid,
  GridItem,
  Heading,
  Stack,
} from '@kadena/react-ui';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { FC, KeyboardEvent } from 'react';
import React, { useEffect, useState } from 'react';
import {
  headerClass,
  headerLoadedClass,
  mostPopularBoxClass,
  searchInputWrapper,
  subheaderClass,
  wrapperClass,
} from './style.css';

interface IProps {
  popularPages: IMostPopularPage[];
}

export const HomeHeader: FC<IProps> = ({ popularPages }) => {
  const router = useRouter();
  const [loaderHeaderClass, setLoaderHeaderClass] =
    useState<string>(headerClass);

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

  useEffect(() => {
    if (router.isReady) {
      setLoaderHeaderClass(classNames(headerClass, headerLoadedClass));
    }
  }, [router.isReady]);

  return (
    <header className={loaderHeaderClass}>
      <div className={wrapperClass}>
        <Box marginInline={{ xs: 'xs', sm: 'md' }}>
          <Grid columns={{ sm: 1, md: 2 }}>
            <GridItem>
              <Heading as="h1" variant="h2">
                Kadena
              </Heading>
              <Stack flexDirection="column" gap="xxs">
                <Heading as="h2" variant="h4">
                  Build your <GradientText>own</GradientText> Internet
                </Heading>
                <span className={subheaderClass}>
                  Explore our guides and examples to build on Kadena
                </span>

                <Box className={searchInputWrapper}>
                  <SearchBar onKeyUp={handleKeyPress} />
                </Box>
              </Stack>
            </GridItem>
            <GridItem>
              {popularPages.length > 0 && (
                <Box className={mostPopularBoxClass} marginInlineEnd="xxxl">
                  <MostPopular pages={popularPages} title="Most viewed docs" />
                </Box>
              )}
            </GridItem>
          </Grid>
        </Box>
      </div>
    </header>
  );
};
