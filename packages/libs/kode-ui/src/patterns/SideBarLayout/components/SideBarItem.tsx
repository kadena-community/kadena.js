import type { FC, PropsWithChildren, ReactElement } from 'react';
import React, { useEffect } from 'react';
import { useMedia } from 'react-use';
import { listItemClass, sidebartreeItemClass } from '../sidebar.css';
import { Anchor } from '../utils';
import type { PressEvent } from './../../../components/Button';
import { Media } from './../../../components/Media';
import { breakpoints } from './../../../styles';
import { useLayout } from './LayoutProvider';

export interface ISideBarItemProps extends PropsWithChildren {
  visual: React.ReactElement;
  label: string | React.ReactElement;
  onPress?: (e: PressEvent) => void;
  isAppContext?: boolean;
  href?: string;
  component?: any;
  tree?: ReactElement | boolean;
}
export const SideBarItem: FC<ISideBarItemProps> = ({
  visual,
  label,
  onPress,
  children,
  href,
  component,
  tree,
}) => {
  const { isExpanded, handleSetExpanded, isActiveUrl } = useLayout();
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

  const render = (isExpanded: boolean) => {
    const LinkWrapper = component ? component : Anchor;
    return (
      <LinkWrapper
        aria-label={label}
        data-isactive={isActiveUrl(href)}
        className={sidebartreeItemClass({
          isActive: isActiveUrl(href),
          isExpanded,
        })}
        href={href}
        to={href}
        title={label}
      >
        {visual && <span>{visual}</span>}
        {isExpanded && label}
      </LinkWrapper>
    );
  };

  if (children) return children;

  return (
    <li className={listItemClass} onClick={handleLinkClick}>
      <Media lessThan="md" style={{ flex: 1, display: 'flex' }}>
        {render(true)}
      </Media>
      <Media greaterThanOrEqual="md" style={{ flex: 1, display: 'flex' }}>
        {render(isExpanded)}
      </Media>

      {tree}
    </li>
  );
};
