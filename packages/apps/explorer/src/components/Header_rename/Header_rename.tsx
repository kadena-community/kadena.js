import { Stack } from '@kadena/kode-ui';
import classNames from 'classnames';

import { useRouter } from '@/hooks/router';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { layoutWrapperClass } from '../Layout_rename/styles.css';
import { NavBar } from '../Navbar_rename/Navbar_rename';
import { SearchBarHeader } from '../Search/SearchbarHeader/SearchbarHeader';
import { StatisticsStack } from '../StatisticsComponent/StatisticsStack/StatisticsStack';
import { fixedClass, fixedVisibleClass, headerClass } from './styles.css';

export const Header: FC = () => {
  const router = useRouter();

  const isSearchPage = useMemo(() => {
    const regExp = new RegExp(/[?#].*/);
    const newUrl = router.asPath.replace(regExp, '');
    return newUrl === '/';
  }, [router.asPath]);
  const { ref: inViewRef, inView } = useInView({
    rootMargin: '20px',
    skip: !isSearchPage,
  });

  return (
    <>
      <Stack as="header" className={layoutWrapperClass}>
        {isSearchPage && (
          <Stack
            data-is-search-page={isSearchPage}
            className={classNames(
              headerClass,
              fixedClass,
              !inView && isSearchPage ? fixedVisibleClass : undefined,
            )}
            alignItems={'center'}
            width="100%"
            gap="md"
          >
            <NavBar isFixed isSearchPage={isSearchPage}>
              <SearchBarHeader />
            </NavBar>
          </Stack>
        )}
        <Stack
          ref={inViewRef}
          className={classNames(headerClass, !isSearchPage && fixedClass)}
          alignItems={'center'}
          width="100%"
          gap="md"
        >
          <NavBar isSearchPage={isSearchPage}>
            {isSearchPage || inView ? <StatisticsStack /> : <SearchBarHeader />}
          </NavBar>
        </Stack>
      </Stack>
    </>
  );
};
