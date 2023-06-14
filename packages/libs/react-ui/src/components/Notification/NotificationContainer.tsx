import { SystemIcon } from '../Icons';

import {
  cardTitleClass,
  colorVariants,
  contentClass,
  expandVariants,
  iconContainerClass,
  iconContainerExpandedClass,
  simpleClass,
} from './Notification.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface INotificationProps {
  icon?: typeof SystemIcon[keyof typeof SystemIcon];
  title?: string;
  children?: React.ReactNode;
  displayCloseButton?: boolean;
  expanded?: boolean;
  color?: keyof typeof colorVariants;
  simplified?: boolean;
}

export const NotificationContainer: FC<INotificationProps> = ({
  icon,
  title,
  children,
  displayCloseButton = false,
  color = 'default',
  simplified = false,
  expanded = false,
}) => {
  const Icon = icon || SystemIcon.HelpCircle;

  const classList = classNames(
    colorVariants[color],
    expandVariants[expanded ? 'true' : 'false'],
  );

  if (simplified || children === undefined) {
    return (
      <div className={classNames(classList, simpleClass)}>
        <div className={iconContainerClass}>
          <Icon size={'md'} />
        </div>

        <p className={contentClass}>{children}</p>
      </div>
    );
  }

  return (
    <div className={classList}>
      <div className={iconContainerClass}>
        <Icon size={'md'} />
      </div>

      <div>
        <p className={contentClass}>
          <h4 className={cardTitleClass}>{title}</h4>
          <p>{children}</p>
        </p>
      </div>

      <div
        className={expanded ? iconContainerExpandedClass : iconContainerClass}
      >
        {displayCloseButton && <SystemIcon.Close size={'md'} />}
      </div>
    </div>
  );
};
