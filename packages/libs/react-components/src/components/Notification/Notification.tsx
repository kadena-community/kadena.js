/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201

import { SystemIcons } from '../Icons';

import {
  StyledHeading,
  StyledIconContainer,
  StyledNotification,
  StyledText,
} from './styles';

import type { VariantProps } from '@stitches/react';
import type { FC } from 'react';
import React from 'react';

export interface INotificationProps {
  icon?: (typeof SystemIcons)[keyof typeof SystemIcons];
  title?: string;
  children?: React.ReactNode;
  displayCloseButton?: boolean;
  expand?: VariantProps<typeof StyledNotification>['expand'];
  color?: VariantProps<typeof StyledNotification>['color'];
  simple?: VariantProps<typeof StyledNotification>['simple'];
}

export const NotificationBody = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return <StyledText as="div">{children}</StyledText>;
};

// For now they are identical, so we can just export a rename of NotificationBody for the Footer
export const NotificationFooter = NotificationBody;

export const Notification: FC<INotificationProps> = ({
  icon,
  title = '',
  children,
  displayCloseButton,
  color,
  simple,
  expand,
}) => {
  const Icon = icon!;
  const isSimple = (simple as boolean) || children === undefined;
  return (
    <StyledNotification color={color} expand={expand} simple={isSimple}>
      {Boolean(Icon) && (
        <StyledIconContainer position="left">
          <Icon size="md" />
        </StyledIconContainer>
      )}

      {title && <StyledHeading as="h6">{title}</StyledHeading>}
      {!isSimple && children}

      {displayCloseButton === true && !isSimple && (
        <StyledIconContainer position="right">
          <SystemIcons.Close size="md" />
        </StyledIconContainer>
      )}
    </StyledNotification>
  );
};
