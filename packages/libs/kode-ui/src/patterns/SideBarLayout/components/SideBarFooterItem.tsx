import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import type { PressEvent } from './../../../components';
import { Button } from './../../../components';

export interface ISideBarFooterItemProps extends PropsWithChildren {
  visual: React.ReactElement;
  label: string;
  onPress: (e: PressEvent) => void;
  isAppContext?: boolean;
}

export const SideBarFooterItem: FC<ISideBarFooterItemProps> = ({
  visual,
  children,
  isAppContext = false,
  label,
  onPress,
}) => {
  if (children) return children;
  return (
    <Button
      onPress={onPress}
      aria-label={label}
      startVisual={visual}
      variant={isAppContext ? 'primary' : 'transparent'}
    />
  );
};
