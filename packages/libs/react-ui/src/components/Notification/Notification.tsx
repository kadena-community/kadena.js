// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Close, Information } from '@components/Icon/System/SystemIcon';
import { Box } from '@components/Layout';
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

export interface INotificationProps {
  children?: React.ReactNode;
  color?: keyof typeof cardColorVariants;
  styleVariant?: keyof typeof displayVariants;
  hasCloseButton?: boolean;
  onClose?: () => void;
  icon?: React.ReactElement;
  role: 'alert' | 'status' | 'none';
}

export const Notification: FC<INotificationProps> = ({
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
      <Box flexShrink={0}>
        {icon ? (
          <span className={iconClass}>{icon}</span>
        ) : (
          <Information size="md" />
        )}
      </Box>

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
