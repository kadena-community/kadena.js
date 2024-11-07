import { MonoMenu, MonoMenuOpen } from '@kadena/kode-icons/system';
import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React, { useEffect, useRef } from 'react';
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
import { useLayout } from './LayoutProvider';
import { KLogo } from './Logo/KLogo';

interface IProps extends PropsWithChildren {
  minifiedLogo?: ReactElement;
  hasSidebar?: boolean;
}

export const SideBarHeader: FC<IProps> = ({ minifiedLogo }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { isExpanded, handleToggleExpand, setBreadcrumbsRef } = useLayout();
  const handleExpand = (e: PressEvent) => {
    if (handleToggleExpand) {
      handleToggleExpand(e);
    }
  };

  const ShowLogo = () => {
    return minifiedLogo ? minifiedLogo : <KLogo height={40} />;
  };

  useEffect(() => {
    if (!ref.current) return;
    setBreadcrumbsRef(ref.current);
  }, [ref.current]);

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
        <Stack ref={ref} style={{ gridArea: 'header-crumbs' }}></Stack>
      </Stack>
    </header>
  );
};
