import { MonoMenu, MonoMenuOpen } from '@kadena/kode-icons/system';
import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import type { PressEvent } from '../Button';
import { Button } from '../Button';
import { Stack } from '../Layout';
import { KadenaLogo } from './components/Logo/KadenaLogo';
import { KLogo } from './components/Logo/KLogo';
import {
  menuLogoClass,
  menuMenuIconClass,
  menuWrapperClass,
} from './style.css';

export interface ISideBar extends PropsWithChildren {
  isExpanded?: boolean;
  logo?: ReactElement;
  onExpand: (e: PressEvent) => void;
}

export const SideBar: FC<ISideBar> = ({
  children,
  isExpanded = false,
  onExpand,
  logo,
}) => {
  const ShowLogo = !isExpanded ? (
    <KLogo className={menuLogoClass} height={40} />
  ) : logo ? (
    logo
  ) : (
    <KadenaLogo height={40} />
  );

  const handleExpand = (e: PressEvent) => {
    if (onExpand) {
      onExpand(e);
    }
  };

  return (
    <aside className={menuWrapperClass({ expanded: isExpanded })}>
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

      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, { ...child.props, isExpanded });
      })}
    </aside>
  );
};
