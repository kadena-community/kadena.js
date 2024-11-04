import type { FC } from 'react';
import React, { forwardRef, useMemo } from 'react';
import { useMedia } from 'react-use';
import { listItemClass } from '../sidebar.css';
import type { ILinkProps } from './../../../components';
import type { IButtonProps, PressEvent } from './../../../components/Button';
import { breakpoints } from './../../../styles';
import { useLayout } from './LayoutProvider';
import { sidebartreeItemClass } from './sidebartree.css';

export interface ISideBarTreeItemProps {
  label: string;
  onPress?: (e: PressEvent) => void;
  href?: string;
  component?: any;
}

const InnerAnchor = forwardRef<HTMLAnchorElement, ILinkProps>(
  ({ children, ...props }, ref) => (
    <a {...props} ref={ref}>
      {children}
    </a>
  ),
);
InnerAnchor.displayName = 'Anchor';

const InnerButton = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ children, ...props }, ref) => (
    <button {...props} ref={ref}>
      {children}
    </button>
  ),
);
InnerButton.displayName = 'Anchor';

export const SideBarTreeItem: FC<ISideBarTreeItemProps> = ({
  label,
  onPress,
  href,
  component,
}) => {
  const { handleSetExpanded, isActiveUrl } = useLayout();
  const isMediumDevice = useMedia(breakpoints.md, true);
  const handlePress = (e: PressEvent) => {
    if (!isMediumDevice) handleSetExpanded(false);
    if (onPress) onPress(e);
  };

  const LinkWrapper = useMemo(() => {
    return href ? (component ? component : InnerAnchor) : InnerButton;
  }, [component, href]);

  return (
    <li className={listItemClass}>
      <LinkWrapper
        className={sidebartreeItemClass}
        href={href}
        to={href}
        onPress={handlePress}
        data-isactive={isActiveUrl(href)}
      >
        {label}
      </LinkWrapper>
    </li>
  );
};
