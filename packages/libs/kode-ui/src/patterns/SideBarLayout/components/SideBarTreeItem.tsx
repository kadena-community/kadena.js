import type { FC, MouseEventHandler, ReactElement } from 'react';
import React, { forwardRef } from 'react';
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
  component?: ReactElement;
  isActive?: boolean;
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
  isActive,
}) => {
  const { handleSetExpanded, isActiveUrl } = useLayout();
  const isMediumDevice = useMedia(breakpoints.md, true);
  const handlePress: MouseEventHandler<HTMLLIElement> = (e) => {
    e.stopPropagation();

    if (!isMediumDevice) {
      handleSetExpanded(false);
    }
    if (onPress) {
      onPress(e as unknown as PressEvent);
    }
  };

  const renderContent = () => {
    const commonProps = {
      className: sidebartreeItemClass,
      'data-isactive': isActive !== undefined ? isActive : isActiveUrl(href),
    };

    if (component) {
      // Clone the custom component with the necessary props
      return React.cloneElement(
        component as ReactElement<Record<string, unknown>>,
        {
          ...commonProps,
          href,
          to: href,
          children: label,
        },
      );
    }

    if (href) {
      return (
        <InnerAnchor
          className={sidebartreeItemClass}
          href={href}
          to={href}
          data-isactive={isActive !== undefined ? isActive : isActiveUrl(href)}
        >
          {label}
        </InnerAnchor>
      );
    }

    return (
      <InnerButton
        className={sidebartreeItemClass}
        data-isactive={isActive !== undefined ? isActive : isActiveUrl(href)}
      >
        {label}
      </InnerButton>
    );
  };

  return (
    <li className={listItemClass} role="button" onClick={handlePress}>
      {renderContent()}
    </li>
  );
};
