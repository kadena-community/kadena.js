import { MonoMenu, MonoMenuOpen } from '@kadena/kode-icons/system';
import classNames from 'classnames';
import type { FC, ReactElement } from 'react';
import React from 'react';
import type { PressEvent } from 'react-aria';
import { useSideBar } from '../SideBarProvider';
import {
  headerWrapperClass,
  menuLogoClass,
  menuMenuIconClass,
} from '../style.css';
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
    <KLogo className={menuLogoClass} height={40} />
  ) : logo ? (
    logo
  ) : (
    <KadenaLogo height={40} />
  );

  return (
    <header className={headerWrapperClass}>
      <Stack width="100%" justifyContent="space-between" alignItems="center">
        {ShowLogo}
        <Stack
          className={classNames(menuMenuIconClass({ expanded: isExpanded }))}
        >
          <Button
            variant="transparent"
            onPress={handleExpand}
            startVisual={isExpanded ? <MonoMenuOpen /> : <MonoMenu />}
          />
        </Stack>
      </Stack>
    </header>
  );
};
