import { SystemIcon } from '../Icons';

import {
  colorVariants,
  iconContainerClass,
  iconStandaloneClass,
} from './NotificationButton.css';

import React, { FC } from 'react';

export interface INotificationButtonProps {
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
  color: keyof typeof colorVariants;
  onClick?: () => void;
  children?: React.ReactNode;
}
export const NotificationButton: FC<INotificationButtonProps> = ({
  icon,
  color,
  onClick,
  children,
}) => {
  const Icon = icon;
  return (
    <button onClick={onClick} className={colorVariants[color]}>
      {children}
      <span
        className={
          children === undefined ? iconStandaloneClass : iconContainerClass
        }
      >
        <Icon size="md" />
      </span>
    </button>
  );
};
