import { MonoMenu, MonoMenuOpen } from '@kadena/kode-icons/system';
import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import type { PressEvent } from './../../components';
import { Button, Media, Stack } from './../../components';
import { LayoutContext, useLayout } from './components/LayoutProvider';
import { KLogo } from './components/Logo/KLogo';
import { KadenaLogo } from './components/Logo/KadenaLogo';
import { SideBarAppContext } from './components/SideBarAppContext';
import { SideBarNavigation } from './components/SideBarNavigation';
import {
  menuBackdropClass,
  menuMenuIconClass,
  menuWrapperClass,
  menuWrapperMobileExpandedClass,
} from './sidebar.css';
import type { ISideBarLayoutLocation } from './types';

export interface ISideBarProps extends PropsWithChildren {
  location?: ISideBarLayoutLocation;
  appContext?: ReactElement;
  navigation?: ReactElement;
  context?: ReactElement;
  logo?: ReactElement;
  minifiedLogo?: ReactElement;
}

export const SideBar: FC<ISideBarProps> = ({
  children,
  appContext,
  navigation,
  context,
  logo,
  minifiedLogo,
}) => {
  const { isExpanded, handleToggleExpand } = useLayout();

  const handleExpand = (e: PressEvent) => {
    if (handleToggleExpand) {
      handleToggleExpand(e);
    }
  };

  const ShowLogo = () => {
    if (!isExpanded) {
      return minifiedLogo ? minifiedLogo : <KLogo height={40} />;
    }

    return logo ? logo : <KadenaLogo height={40} />;
  };

  return (
    <>
      <Stack
        className={menuBackdropClass({ expanded: isExpanded })}
        onClick={handleExpand}
      />
      <aside
        className={classNames(menuWrapperClass({ expanded: isExpanded }), {
          [menuWrapperMobileExpandedClass]: isExpanded,
        })}
      >
        <Stack className={classNames(menuMenuIconClass)}>
          <div>
            <Media lessThan="md">{ShowLogo()}</Media>
            <Media greaterThanOrEqual="md">{ShowLogo()}</Media>
          </div>

          <Button
            variant="transparent"
            onPress={handleExpand}
            startVisual={isExpanded ? <MonoMenuOpen /> : <MonoMenu />}
          />
        </Stack>

        {appContext && <SideBarAppContext>{appContext}</SideBarAppContext>}
        {navigation && <SideBarNavigation>{navigation}</SideBarNavigation>}
        {context && <LayoutContext>{context}</LayoutContext>}

        {children}
      </aside>
    </>
  );
};
