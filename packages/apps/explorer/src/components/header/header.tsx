import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { layoutWrapperClass } from '../layout/styles.css';

import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import { NavBar } from '../navbar/navbar';
import StatisticsComponent from '../statistics-component/statistics-component';
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
          <NavBar>Hier komt de searchbar</NavBar>
        </Stack>
        <Stack
          ref={ref}
          className={headerClass}
          alignItems={'center'}
          width="100%"
          gap="md"
        >
          <NavBar>
            <StatisticsComponent />
          </NavBar>
        </Stack>
      </Stack>
    </>
  );
};

export default Header;
