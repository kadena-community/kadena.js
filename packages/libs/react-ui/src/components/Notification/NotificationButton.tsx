import { colorVariants, iconContainerClass } from './NotificationButton.css';

import { SystemIcon } from '@components/Icon';
import React, { FC } from 'react';

export interface INotificationButtonProps {
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
  color: keyof typeof colorVariants;
  onClick?: JSX.IntrinsicElements['button']['onClick'];
  children: React.ReactNode;
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
      <span className={iconContainerClass}>
        <Icon size="md" />
      </span>
    </button>
  );
};
