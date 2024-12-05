import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import type { PressEvent } from './../../../components';
import { Button, Link } from './../../../components';
import { useLayout } from './LayoutProvider';

export interface ISideBarFooterItemProps extends PropsWithChildren {
  visual: React.ReactElement;
  label: string;
  onPress?: (e: PressEvent) => void;
  isAppContext?: boolean;
  href?: string;
  component?: any;
}

export const SideBarFooterItem: FC<ISideBarFooterItemProps> = ({
  visual,
  children,
  isAppContext = false,
  label,
  onPress,
  href,
  component,
}) => {
  const { isActiveUrl } = useLayout();

  if (children) return children;

  const handlePress = (e: PressEvent) => {
    if (onPress) onPress(e);
  };

  const Component = href ? Link : Button;

  return (
    <Component
      component={component}
      href={href}
      onPress={handlePress}
      aria-label={label}
      startVisual={visual}
      isDisabled={isActiveUrl(href)}
      variant={isAppContext ? 'primary' : 'transparent'}
    />
  );
};
