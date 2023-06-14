import { SystemIcon } from '../Icons';

import {
  cardTitleClass,
  colorVariants,
  containerClass,
  contentClass,
  expandVariants,
  footerClass,
  headerContainerClass,
  iconContainerClass,
  iconContainerFullWidthClass,
  simpleClass,
} from './Notification.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface INotificationProps {
  icon?: typeof SystemIcon[keyof typeof SystemIcon];
  title: string;
  children?: React.ReactNode;
  displayCloseButton?: boolean;
  expand?: boolean;
  color?: keyof typeof colorVariants;
  simple?: boolean;
}

export const NotificationContainer: FC<INotificationProps> = ({
  icon,
  title,
  children,
  displayCloseButton,
  color = 'default',
  simple,
  expand = false,
}) => {
  const Icon = icon || SystemIcon.HelpCircle;

  const classList = classNames(
    colorVariants[color],
    expandVariants[expand ? 'true' : 'false'],
  );

  if (simple || !children) {
    return (
      <div className={classNames(classList, simpleClass)}>
        <div className={iconContainerClass}>
          <Icon size={'md'} />
        </div>

        <p className={contentClass}>{title}</p>
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
        className={expand ? iconContainerFullWidthClass : iconContainerClass}
      >
        <div className={headerContainerClass} />
        {displayCloseButton && <SystemIcon.Close size={'md'} />}
      </div>
    </div>
  );
};
