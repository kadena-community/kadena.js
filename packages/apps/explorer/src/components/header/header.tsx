import { Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { layoutWrapperClass } from '../layout/styles.css';
import { NavBar } from '../navbar/navbar';
import SearchBarHeader from '../search/searchbar-header/searchbar-header';
import StatisticsStack from '../statistics-component/statistics-stack/statistics-stack';
import { fixedClass, fixedVisibleClass, headerClass } from './styles.css';

const Header: FC = () => {
  const location = usePathname();
  const isSearchPage = location === '/';
  const { ref, inView } = useInView({
    rootMargin: '20px',
    skip: !isSearchPage,
  });

  return (
    <>
      <Stack as="header" className={layoutWrapperClass}>
        {isSearchPage && (
          <Stack
            data-isSearchPage={isSearchPage}
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
          ref={ref}
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
