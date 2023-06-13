import { SystemIcon } from '../Icons';

import {
  cardTitleClass,
  colorVariants,
  contentClass,
  expandClass,
  footerClass,
  headerContainerClass,
  iconContainerClass,
  iconContainerFullWidthClass,
  simpleClass,
  simpleContentClass,
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

  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Notification: FC<INotificationProps> = ({
  icon,
  title,
  children,
  displayCloseButton,
  color = 'default',
  simple,
  expand = false,
  header,
  footer,
}) => {
  const isSimple = (simple as boolean) || children === undefined;
  const Icon = icon || SystemIcon.HelpCircle;

  return (
    <div
      className={classNames([colorVariants[color!]], {
        [expandClass]: expand,
        [simpleClass]: isSimple,
      })}
    >
      <div className={iconContainerClass}>
        <Icon size={'md'} />
      </div>

      <div>
        {isSimple ? (
          <p className={simpleContentClass}>{title}</p>
        ) : (
          <p className={contentClass}>
            <h4 className={cardTitleClass}>{title}</h4>
            <p>{children}</p>
          </p>
        )}

        {!isSimple && <div className={footerClass}>{footer}</div>}
      </div>

      {!isSimple && (
        <div
          className={expand ? iconContainerFullWidthClass : iconContainerClass}
        >
          {header !== undefined && (
            <div className={headerContainerClass}>{header}</div>
          )}
          {displayCloseButton && <SystemIcon.Close size={'md'} />}
        </div>
      )}
    </div>
  );
};
