import { Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { layoutWrapperClass } from '../Layout/styles.css';
import { NavBar } from '../Navbar/Navbar';
import { SearchBarHeader } from '../Search/SearchbarHeader/SearchbarHeader';
import { StatisticsStack } from '../StatisticsComponent/StatisticsStack/StatisticsStack';
import { fixedClass, fixedVisibleClass, headerClass } from './styles.css';

export const Header: FC = () => {
  const { ref: inViewRef, inView } = useInView({
    rootMargin: '20px',
  });

  return (
    <>
      <Stack as="header" className={layoutWrapperClass}>
        <Stack
          className={classNames(
            headerClass,
            fixedClass,
            !inView ? fixedVisibleClass : undefined,
          )}
          alignItems={'center'}
          width="100%"
          gap="md"
        >
          <NavBar isFixed>
            {inView ? <StatisticsStack /> : <SearchBarHeader />}
          </NavBar>
        </Stack>

        <Stack
          ref={inViewRef}
          className={classNames(headerClass)}
          alignItems={'center'}
          width="100%"
          gap="md"
        >
          <NavBar>{inView ? <StatisticsStack /> : <SearchBarHeader />}</NavBar>
        </Stack>
      </Stack>
    </>
  );
};
