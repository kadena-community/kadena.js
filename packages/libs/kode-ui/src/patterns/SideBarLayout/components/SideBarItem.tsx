import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import { useMedia } from 'react-use';
import { listItemClass } from '../sidebar.css';
import { Link } from './../../../components';
import type { PressEvent } from './../../../components/Button';
import { Button } from './../../../components/Button';
import { Media } from './../../../components/Media';
import { breakpoints } from './../../../styles';
import { useSideBar } from './SideBarProvider';

export interface ISideBarItemProps extends PropsWithChildren {
  visual: React.ReactElement;
  label: string;
  onPress?: (e: PressEvent) => void;
  isAppContext?: boolean;
  href?: string;
  component?: any;
}
export const SideBarItem: FC<ISideBarItemProps> = ({
  visual,
  label,
  onPress,
  children,
  href,
  component,
}) => {
  const { isExpanded, handleSetExpanded, isActiveUrl } = useSideBar();
  const isMediumDevice = useMedia(breakpoints.md, true);

  useEffect(() => {
    handleSetExpanded(isMediumDevice ? true : false);
  }, [isMediumDevice]);

  const handlePress = (e: PressEvent) => {
    if (!isMediumDevice) handleSetExpanded(false);

    if (onPress) onPress(e);
  };

  const handleLinkClick = (e: any) => {
    handlePress(e as unknown as PressEvent);
  };

  const renderChildren = () => {
    return (
      <>
        <Media greaterThanOrEqual="md" style={{ flex: 1, display: 'flex' }}>
          {children}
        </Media>
        <Media lessThan="md" style={{ flex: 1, display: 'flex' }}>
          {children}
        </Media>
      </>
    );
  };

  const renderMobile = () => {
    const Component = href ? Link : Button;
    return (
      <Component
        onPress={handleLinkClick}
        href={href}
        variant={isActiveUrl(href) ? 'primary' : 'outlined'}
        aria-label={label}
        data-isactive={isActiveUrl(href)}
        component={component}
        startVisual={visual}
      >
        {label}
      </Component>
    );
  };

  const renderDeskTopNotExpanded = () => {
    const Component = href ? Link : Button;
    return (
      <Component
        onPress={handleLinkClick}
        variant={isActiveUrl(href) ? 'primary' : 'outlined'}
        aria-label={label}
        data-isactive={isActiveUrl(href)}
        component={component}
        startVisual={visual}
        href={href}
      />
    );
  };

  const renderDeskTopExpanded = () => {
    const Component = href ? Link : Button;
    return (
      <Component
        onPress={handleLinkClick}
        aria-label={label}
        data-isactive={isActiveUrl(href)}
        startVisual={visual}
        component={component}
        variant={isActiveUrl(href) ? 'primary' : 'outlined'}
        href={href}
      >
        {label}
      </Component>
    );
  };

  return (
    <li className={listItemClass}>
      <>
        {children ? (
          renderChildren()
        ) : (
          <>
            <Media lessThan="md" style={{ flex: 1, display: 'flex' }}>
              {renderMobile()}
            </Media>
            <Media greaterThanOrEqual="md" style={{ flex: 1, display: 'flex' }}>
              {!isExpanded
                ? renderDeskTopNotExpanded()
                : renderDeskTopExpanded()}
            </Media>
          </>
        )}
      </>
    </li>
  );
};
