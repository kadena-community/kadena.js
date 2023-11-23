import type { FC } from 'react';
import React from 'react';
import { actionButtonColorVariants } from './Notification.css';

export interface INotificationButtonProps {
  color: keyof typeof actionButtonColorVariants;
  onClick?: () => void;
  children: React.ReactNode;
}
export const NotificationButton: FC<INotificationButtonProps> = ({
  color,
  onClick,
  children,
}) => {
  return (
    <button onClick={onClick} className={actionButtonColorVariants[color]}>
      {children}
    </button>
  );
};
