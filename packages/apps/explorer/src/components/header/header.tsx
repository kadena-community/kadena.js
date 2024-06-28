import { SpireKeyKdacolorLogoWhite } from '@kadena/react-icons/product';
import { Button, Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { GraphQLQueryDialog } from '../graphql-query-dialog/graphql-query-dialog';
import { layoutWrapperClass } from '../layout/styles.css';
import { NavBar } from '../navbar/navbar';
import StatisticsStack from '../statistics-component/statistics-stack/statistics-stack';
import {
  fixedClass,
  fixedVisibleClass,
  headerClass,
  menuClass,
  menuOpenClass,
} from './styles.css';

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
      <Stack
        flexDirection="column"
        width="100%"
        className={classNames(menuClass, menuIsOpen && menuOpenClass)}
      >
        <Stack paddingBlock="xxxl" />
        <Stack width="100%">
          <GraphQLQueryDialog />

          <Button
            variant="primary"
            startVisual={<SpireKeyKdacolorLogoWhite />}
          />
        </Stack>
      </Stack>
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
            Hier komt de searchbar
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
