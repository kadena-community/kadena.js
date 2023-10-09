// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  cardColorVariants,
  closeButtonClass,
  colorVariants,
  containerClass,
  contentClass,
  descriptionClass,
  displayVariants,
  expandVariants,
  inlineVariants,
} from './Notification.css';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

type DisplayVariants = 'standard' | 'outlined';

export interface INotificationProps {
  icon?: keyof typeof SystemIcon;
  title?: string;
  children?: React.ReactNode;
  expanded?: boolean;
  color?: keyof typeof colorVariants;
  hasCloseButton?: boolean;
  onClose?: () => void;
  variant?: DisplayVariants;
  inline?: boolean;
}

export const NotificationContainer: FC<INotificationProps> = ({
  icon,
  title,
  children,
  hasCloseButton = false,
  color = 'info',
  expanded = false,
  onClose,
  variant = 'standard',
  inline = false,
}) => {
  const Icon = icon ? SystemIcon[icon] : SystemIcon.HelpCircle;

  const inlineVariantsClass = inlineVariants[inline ? 'true' : 'false'];

  const classList = classNames(
    containerClass,
    cardColorVariants[color],
    displayVariants[variant],
    expandVariants[expanded ? 'true' : 'false'],
    inlineVariantsClass,
  );

  const contentClassList = classNames(contentClass, inlineVariantsClass);

  const descriptionClassList = classNames(
    descriptionClass,
    inlineVariantsClass,
  );

  return (
    <div className={classList}>
      <Icon size="md" />

      <div className={contentClassList}>
        {title && <h4>{title}</h4>}
        <div className={descriptionClassList}>{children}</div>
      </div>

      {hasCloseButton && (
        <button
          className={closeButtonClass}
          onClick={onClose}
          aria-label="Close Notification"
        >
          <SystemIcon.Close size="md" />
        </button>
      )}
    </div>
  );
};
