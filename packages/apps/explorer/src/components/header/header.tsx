import { Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { layoutWrapperClass } from '../layout/styles.css';
import { NavBar } from '../navbar/navbar';
import StatisticsStack from '../statistics-component/statistics-stack/statistics-stack';
import { fixedClass, fixedVisibleClass, headerClass } from './styles.css';

const Header: FC = () => {
  const { ref, inView } = useInView({
    rootMargin: '20px',
  });

  return (
    <>
      <Stack as="header" className={layoutWrapperClass}>
        <Stack
          className={classNames(
            headerClass,
            fixedClass,
            !inView && fixedVisibleClass,
          )}
          alignItems={'center'}
          width="100%"
          gap="md"
        >
          <NavBar isFixed>Hier komt de searchbar</NavBar>
        </Stack>
        <Stack
          ref={ref}
          className={headerClass}
          alignItems={'center'}
          width="100%"
          gap="md"
        >
          <NavBar>
            <StatisticsStack />
          </NavBar>
        </Stack>
      </Stack>
    </>
  );
};

export default Header;
