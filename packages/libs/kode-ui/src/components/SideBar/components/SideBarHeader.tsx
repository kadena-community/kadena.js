import { MonoMenu, MonoMenuOpen } from '@kadena/kode-icons/system';
import classNames from 'classnames';
import type { FC, ReactElement } from 'react';
import React from 'react';
import type { PressEvent } from 'react-aria';
import { useSideBar } from '../SideBarProvider';
import {
  headerClass,
  headerExpandedClass,
  headerWrapperClass,
  menuMenuIconClass,
} from '../style.css';
import { Media } from './../../../components/Media';
import { Button } from './../../Button';
import { Stack } from './../../Layout';
import { KLogo } from './Logo/KLogo';
import { KadenaLogo } from './Logo/KadenaLogo';

interface IProps {
  logo?: ReactElement;
}

export const SideBarHeader: FC<IProps> = ({ logo }) => {
  const { isExpanded, handleToggleExpand } = useSideBar();
  const handleExpand = (e: PressEvent) => {
    if (handleToggleExpand) {
      handleToggleExpand(e);
    }
  };

  const ShowLogo = !isExpanded ? (
    <KLogo height={40} />
  ) : logo ? (
    logo
  ) : (
    <KadenaLogo height={40} />
  );

  return (
    <header className={headerWrapperClass}>
      <Stack
        className={classNames(headerClass, {
          [headerExpandedClass]: !isExpanded,
        })}
        width="100%"
        alignItems="center"
      >
        <Stack style={{ gridArea: 'header-logo' }}>
          <>
            <Media lessThan="md">
              <KLogo height={40} />
            </Media>
            <Media greaterThanOrEqual="md">{ShowLogo}</Media>
          </>
        </Stack>
        <Stack className={classNames(menuMenuIconClass)}>
          <Button
            variant="transparent"
            onPress={handleExpand}
            startVisual={isExpanded ? <MonoMenuOpen /> : <MonoMenu />}
          />
        </Stack>
        <Stack style={{ gridArea: 'header-crumbs' }}>breadcrumbs</Stack>
      </Stack>
    </header>
  );
};
