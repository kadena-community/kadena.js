// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  cardColorVariants,
  closeButtonClass,
  colorVariants,
  containerClass,
  containerWrapperClass,
  contentClass,
  descriptionClass,
  displayVariants,
  expandVariants,
  inlineVariants,
  titleClass,
} from './Notification.css';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useId } from 'react';

export interface INotificationProps {
  icon?: keyof typeof SystemIcon;
  title?: string;
  children?: React.ReactNode;
  expanded?: boolean;
  color?: keyof typeof colorVariants;
  hasCloseButton?: boolean;
  onClose?: () => void;
  variant?: keyof typeof displayVariants;
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

  const id = useId();
  const labelId = `label-${id}`;
  const descriptionId = `description-${id}`;

  return (
    <div
      className={classList}
      role="alert"
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
    >
      <div className={containerWrapperClass}>
        <Icon size="md" />

        <div className={contentClassList}>
          {title && <span  id={labelId} className={titleClass}>{title}</span>}
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
    </div>
  );
};
