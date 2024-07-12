import { Stack } from '@kadena/kode-ui';
import classNames from 'classnames';

import type { FC } from 'react';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { layoutWrapperClass } from '../layout/styles.css';
import { NavBar } from '../navbar/navbar';
import { useRouter } from '../routing/useRouter';
import SearchBarHeader from '../search/searchbar-header/searchbar-header';
import StatisticsStack from '../statistics-component/statistics-stack/statistics-stack';
import { fixedClass, fixedVisibleClass, headerClass } from './styles.css';

const Header: FC = () => {
  const router = useRouter();
  const isSearchPage = router.asPath === '/';
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

export default Header;
