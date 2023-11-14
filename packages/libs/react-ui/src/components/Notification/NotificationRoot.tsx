// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Close, HelpCircle } from '@components/Icon/System/SystemIcon';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useState } from 'react';
import {
  cardColorVariants,
  closeButtonClass,
  containerClass,
  contentClass,
  displayVariants,
  iconClass,
} from './Notification.css';

export interface INotificationRootProps {
  children?: React.ReactNode;
  color?: keyof typeof cardColorVariants;
  styleVariant?: keyof typeof displayVariants;
  hasCloseButton?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  role: 'alert' | 'status' | 'none';
}

export const NotificationRoot: FC<INotificationRootProps> = ({
  children,
  hasCloseButton = false,
  color = 'info',
  styleVariant = 'bordered',
  onClose,
  icon,
  role,
}) => {
  const [isClosed, setIsClosed] = useState(false);
  const classList = classNames(
    containerClass,
    cardColorVariants[color],
    displayVariants[styleVariant],
  );

  if (isClosed) return null;

  return (
    <div className={classList} role={role}>
      {icon ? (
        <span className={iconClass}>{icon}</span>
      ) : (
        <HelpCircle size="md" />
      )}

      <div className={contentClass}>{children}</div>

      {hasCloseButton && (
        <button
          className={closeButtonClass}
          onClick={() => {
            setIsClosed(true);
            onClose?.();
          }}
          aria-label="Close Notification"
        >
          <Close size="md" />
        </button>
      )}
    </div>
  );
};
