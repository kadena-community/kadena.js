import { IIconButtonProps } from '../IconButton';
import { SystemIcons } from '../Icons';

import {
  StyledHeading,
  StyledIconButton,
  StyledNotification,
  StyledText,
} from './styles';

import { VariantProps } from '@stitches/react';
import React, { FC } from 'react';

export interface INotificationProps {
  icon?: (typeof SystemIcons)[keyof typeof SystemIcons];
  title: string;
  children?: React.ReactNode;
  displayCloseButton?: boolean;
  expand?: VariantProps<typeof StyledNotification>['expand'];

  color?: VariantProps<typeof StyledNotification>['color'];

  simple?: VariantProps<typeof StyledNotification>['simple'];

  footerContent?: React.ReactNode;
}

export const NotificationBody = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <StyledText as="p">{children}</StyledText>;
};

export const NotificationFooter = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  //return <StyledHeading as="h6">{children}</StyledHeading>
  return <StyledText as="p">{children}</StyledText>;
};

export const Notification: FC<INotificationProps> = ({
  icon,
  title,
  children,
  displayCloseButton,
  color,
  simple,
  expand,
  footerContent,
}) => {
  const Icon = icon!;
  const isSimple = (simple as boolean) || children === undefined;
  return (
    <StyledNotification color={color} expand={expand} simple={isSimple}>
      <StyledIconButton
        position="left"
        color={color as IIconButtonProps['color']}
        title="icon"
        icon={Icon}
      />

      <StyledHeading as="h6">{title}</StyledHeading>
      {!isSimple && children}

      {displayCloseButton === true && !isSimple && (
        <StyledIconButton
          position="right"
          color={color as IIconButtonProps['color']}
          title="close-btn"
          icon={SystemIcons.Close!}
        />
      )}
    </StyledNotification>
  );
};
