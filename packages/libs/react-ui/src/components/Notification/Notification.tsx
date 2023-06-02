/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201
import {
  cardTitleClass,
  colorVariants,
  containerClass,
  contentClass,
  expandClass,
  footerClass,
  simpleClass,
  simpleContentClass,
} from './Notification.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface INotificationProps {
  //icon?: (typeof SystemIcons)[keyof typeof SystemIcons];
  title: string;
  children?: React.ReactNode;
  //displayCloseButton?: boolean;
  expand?: boolean;
  color?: keyof typeof colorVariants;
  simple?: boolean;

  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const NotificationBody = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return <p>{children}</p>;
};

// For now they are identical, so we can just export a rename of NotificationBody for the Footer
export const NotificationFooter = NotificationBody;

export const Notification: FC<INotificationProps> = ({
  //icon,
  title,
  children,
  //displayCloseButton,
  color,
  simple,
  expand,
  header,
  footer,
}) => {
  //const Icon = icon!;
  //const isSimple = (simple as boolean) || children === undefined;
  /*
  return (
    <StyledNotification color={color} expand={expand} simple={isSimple}>
      <StyledIconContainer position="left">
        <Icon size="md" />
      </StyledIconContainer>

      <StyledHeading as="h6">{title}</StyledHeading>
      {!isSimple && children}

      {displayCloseButton === true && !isSimple && (
        <StyledIconContainer position="right">
          <SystemIcons.Close size="md" />
        </StyledIconContainer>
      )}
    </StyledNotification>
  );*/
  const isSimple = (simple as boolean) || children === undefined;

  return (
    <div
      className={classNames(containerClass, {
        [colorVariants[color!]]: color,
        [expandClass]: expand,
        [simpleClass]: isSimple,
      })}
    >
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
  );
};
