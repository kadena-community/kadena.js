import { IconButton } from '../IconButton/IconButton';
import { SystemIcon } from '../Icons';

import {
  cardTitleClass,
  colorVariants,
  containerClass,
  containerClassRightPadded,
  contentClass,
  expandVariants,
  iconContainerClass,
  iconContainerExpandedClass,
} from './Notification.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface INotificationProps {
  icon?: (typeof SystemIcon)[keyof typeof SystemIcon];
  title?: string;
  children?: React.ReactNode;
  expanded?: boolean;
  color?: keyof typeof colorVariants;
  hasCloseButton?: boolean;
  onClose?: () => void;
}

export const NotificationContainer: FC<INotificationProps> = ({
  icon,
  title,
  children,
  hasCloseButton = false,
  color = 'primary',
  expanded = false,
  onClose,
}) => {
  const Icon = icon || SystemIcon.HelpCircle;

  const classList = classNames(
    hasCloseButton ? containerClass : containerClassRightPadded,
    colorVariants[color],
    expandVariants[expanded ? 'true' : 'false'],
  );

  return (
    <div className={classList}>
      <span className={iconContainerClass}>
        <Icon size={'md'} />
      </span>

      <div>
        <p className={contentClass}>
          {title !== undefined && <h4 className={cardTitleClass}>{title}</h4>}
          <p>{children}</p>
        </p>
      </div>

    
      <span
        className={expanded ? iconContainerExpandedClass : undefined}
      >
        {hasCloseButton && 
        <IconButton
        title={'Close'}
        onClick={onClose}
        icon={SystemIcon.Close}
        ></IconButton>
        }
      </span>
    </div>
  );
};
