import { MonoMenu, MonoMenuOpen } from '@kadena/kode-icons/system';
import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import type { PressEvent } from './../../components';
import { Button, Stack } from './../../components';
import { useLayout } from './components/LayoutProvider';
import { KLogo } from './components/Logo/KLogo';
import { SideBarAppContext } from './components/SideBarAppContext';
import { SideBarContext } from './components/SideBarContext';
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
}

export const SideBar: FC<ISideBarProps> = ({
  children,
  appContext,
  navigation,
  context,
  logo,
}) => {
  const { isExpanded, handleToggleExpand } = useLayout();

  const handleExpand = (e: PressEvent) => {
    if (handleToggleExpand) {
      handleToggleExpand(e);
    }
  };

  const ShowLogo = () => {
    return logo ? logo : <KLogo height={40} />;
  };

  return (
    <>
      <button
        type="button"
        className={menuBackdropClass({ expanded: isExpanded })}
        onClick={(e) => handleExpand(e as unknown as PressEvent)}
      />

      <aside
        data-testid="leftaside"
        className={classNames(menuWrapperClass({ expanded: isExpanded }), {
          [menuWrapperMobileExpandedClass]: isExpanded,
        })}
      >
        <Stack className={classNames(menuMenuIconClass)}>
          {ShowLogo()}

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
