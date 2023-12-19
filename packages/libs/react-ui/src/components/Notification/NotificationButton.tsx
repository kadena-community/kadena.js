import type { FC } from 'react';
import React from 'react';
import {
  actionButtonIconClass,
  actionButtonIntentVariants,
} from './Notification.css';

export interface INotificationButtonProps {
  intent: keyof typeof actionButtonIntentVariants;
  onClick?: () => void;
  children: React.ReactNode;
  icon: React.ReactElement;
}
export const NotificationButton: FC<INotificationButtonProps> = ({
  intent,
  onClick,
  children,
  icon,
}) => {
  return (
    <button onClick={onClick} className={actionButtonIntentVariants[intent]}>
      {children}
      <span className={actionButtonIconClass}>{icon}</span>
    </button>
  );
};
