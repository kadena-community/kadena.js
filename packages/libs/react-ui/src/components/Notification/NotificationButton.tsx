import { actionButtonColorVariants } from './Notification.css';

import { SystemIcon } from '@components/Icon';
import type { FC } from 'react';
import React from 'react';

export interface INotificationButtonProps {
  icon: keyof typeof SystemIcon;
  color: keyof typeof actionButtonColorVariants;
  onClick?: () => void;
  children: React.ReactNode;
}
export const NotificationButton: FC<INotificationButtonProps> = ({
  icon,
  color,
  onClick,
  children,
}) => {
  const Icon = icon && SystemIcon[icon];

  return (
    <button onClick={onClick} className={actionButtonColorVariants[color]}>
      {children}
      <Icon size="md" />
    </button>
  );
};
