import { Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { layoutWrapperClass } from '../layout/styles.css';
import { NavBar } from '../navbar/navbar';
import Sidemenu from '../sidemenu/sidemenu';
import StatisticsStack from '../statistics-component/statistics-stack/statistics-stack';
import { fixedClass, fixedVisibleClass, headerClass } from './styles.css';

const Header: FC = () => {
  const { ref, inView } = useInView({
    rootMargin: '20px',
  });
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const handleToggleMenu = () => {
    setMenuIsOpen((v) => !v);
  };

  return (
    <>
      <Sidemenu isOpen={menuIsOpen} />

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
          <NavBar
            isFixed
            handleToggleMenu={handleToggleMenu}
            menuIsOpen={menuIsOpen}
          >
            {/*  Here comes the search bar */}
          </NavBar>
        </Stack>
        <Stack
          ref={ref}
          className={headerClass}
          alignItems={'center'}
          width="100%"
          gap="md"
        >
          <NavBar handleToggleMenu={handleToggleMenu} menuIsOpen={menuIsOpen}>
            <StatisticsStack />
          </NavBar>
        </Stack>
      </Stack>
    </>
  );
};

export default Header;
