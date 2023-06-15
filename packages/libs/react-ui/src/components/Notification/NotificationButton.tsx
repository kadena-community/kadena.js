import { SystemIcon } from '../Icons';

import { colorVariants, iconContainerClass } from './NotificationButton.css';

import React, { FC } from 'react';

export interface INotificationButtonProps {
  icon: typeof SystemIcon[keyof typeof SystemIcon];
  color: keyof typeof colorVariants;
  children: React.ReactNode;
}
export const NotificationButton: FC<INotificationButtonProps> = ({
  icon,
  color,
  children,
}) => {
  const Icon = icon;
  return (
    <button className={colorVariants[color]}>
      {children}
      <div className={iconContainerClass}>
        <Icon size="md" />
      </div>
    </button>
  );
};
