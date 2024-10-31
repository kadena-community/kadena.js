import { MonoMenu, MonoMenuOpen } from '@kadena/kode-icons/system';
import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import type { PressEvent } from './../../components';
import { Button, Media, Stack } from './../../components';
import { KLogo } from './components/Logo/KLogo';
import { KadenaLogo } from './components/Logo/KadenaLogo';
import { SideBarAppContext } from './components/SideBarAppContext';
import { SideBarContext } from './components/SideBarContext';
import { SideBarNavigation } from './components/SideBarNavigation';
import { useSideBar } from './components/SideBarProvider';
import {
  menuBackdropClass,
  menuMenuIconClass,
  menuWrapperClass,
  menuWrapperMobileExpandedClass,
} from './sidebar.css';

export interface ISideBarProps extends PropsWithChildren {
  activeUrl?: string;
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
  const { isExpanded, handleToggleExpand } = useSideBar();

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
          <Media lessThan="md">{ShowLogo()}</Media>
          <Media greaterThanOrEqual="md">{ShowLogo()}</Media>

          <Button
            variant="transparent"
            onPress={handleExpand}
            startVisual={isExpanded ? <MonoMenuOpen /> : <MonoMenu />}
          />
        </Stack>

        {appContext && <SideBarAppContext>{appContext}</SideBarAppContext>}
        {navigation && <SideBarNavigation>{navigation}</SideBarNavigation>}
        {context && <SideBarContext>{context}</SideBarContext>}

        {children}
      </aside>
    </>
  );
};
