import { MonoMenu } from '@kadena/kode-icons/system';
import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React, { useEffect, useRef } from 'react';
import type { PressEvent } from 'react-aria';
import {
  crumbsWrapperClass,
  headerClass,
  headerExpandedClass,
  headerWrapperClass,
  menuMenuIconClass,
  rightsideWrapperClass,
} from '../sidebar.css';
import { Button } from './../../../components/Button';
import { Stack } from './../../../components/Layout';
import { Media } from './../../../components/Media';
import { useLayout } from './LayoutProvider';
import { KLogoText } from './Logo/KLogoText';

interface IProps extends PropsWithChildren {
  logo?: ReactElement;
  topbannerHeight?: number;
}

export const SideBarHeader: FC<IProps> = ({ logo, topbannerHeight = 0 }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const contextRef = useRef<HTMLDivElement | null>(null);
  const {
    isExpanded,
    handleToggleExpand,
    setBreadcrumbsRef,
    setHeaderContextRef,
  } = useLayout();
  const handleExpand = (e: PressEvent) => {
    if (handleToggleExpand) {
      handleToggleExpand(e);
    }
  };

  const ShowLogo = () => {
    return logo ? logo : <KLogoText />;
  };

  useEffect(() => {
    if (!ref.current || !contextRef.current) return;
    setBreadcrumbsRef(ref.current);
    setHeaderContextRef(contextRef.current);
  }, [ref.current, contextRef.current]);

  return (
    <header
      className={headerWrapperClass({ sideBarExpanded: isExpanded })}
      style={{ top: topbannerHeight }}
    >
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
              aria-label="Toggle sidemenu"
              variant="transparent"
              onPress={handleExpand}
              startVisual={<MonoMenu />}
            />
          </Stack>
        </Media>
        <Stack className={crumbsWrapperClass} ref={ref}></Stack>
        <Stack className={rightsideWrapperClass} ref={contextRef}></Stack>
      </Stack>
    </header>
  );
};
