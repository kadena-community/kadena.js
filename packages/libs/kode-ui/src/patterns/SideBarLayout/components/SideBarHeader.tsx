import { MonoMenu, MonoMenuOpen } from '@kadena/kode-icons/system';
import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import type { PressEvent } from 'react-aria';
import {
  headerClass,
  headerExpandedClass,
  headerWrapperClass,
  menuMenuIconClass,
} from '../sidebar.css';
import { Button } from './../../../components/Button';
import { Stack } from './../../../components/Layout';
import { Media } from './../../../components/Media';
import { KLogo } from './Logo/KLogo';
import { useSideBar } from './SideBarProvider';

interface IProps extends PropsWithChildren {
  breadcrumbs?: ReactElement;
  minifiedLogo?: ReactElement;
  hasSidebar?: boolean;
}

export const SideBarHeader: FC<IProps> = ({ breadcrumbs, minifiedLogo }) => {
  const { isExpanded, handleToggleExpand } = useSideBar();
  const handleExpand = (e: PressEvent) => {
    if (handleToggleExpand) {
      handleToggleExpand(e);
    }
  };

  const ShowLogo = () => {
    return minifiedLogo ? minifiedLogo : <KLogo height={40} />;
  };

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
            <Media lessThan="md">{ShowLogo()}</Media>
          </>
        </Stack>
        <Media lessThan="md">
          <Stack className={classNames(menuMenuIconClass)}>
            <Button
              variant="transparent"
              onPress={handleExpand}
              startVisual={isExpanded ? <MonoMenuOpen /> : <MonoMenu />}
            />
          </Stack>
        </Media>
        <Stack style={{ gridArea: 'header-crumbs' }}>{breadcrumbs}</Stack>
      </Stack>
    </header>
  );
};
