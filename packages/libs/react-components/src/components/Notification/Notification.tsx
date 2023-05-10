import { SystemIcons } from '../Icons';

import {
  AbsoluteButton,
  NotificationColor,
  StyledButton,
  StyledHeading,
  StyledIconButton,
  StyledNotification,
  StyledText,
} from './styles';

import React, { FC } from 'react';

export interface INotificationProps {
  icon?: (typeof SystemIcons)[keyof typeof SystemIcons];

  title: string;
  description?: string;
  displayCloseButton?: boolean;
  expand?: boolean;

  actionButtonLabel?: string;
  actionButtonOnClick?: () => void;
  displayActionButton?: boolean;

  color?: NotificationColor;

  simple?: boolean;
}

export const Notification: FC<INotificationProps> = ({
  icon,
  title,
  description,
  displayCloseButton,
  actionButtonLabel,
  actionButtonOnClick,
  displayActionButton,
  color,
  simple,
  expand,
}) => {
  const Icon = icon!;
  const isSimple =
    simple === true ||
    (displayActionButton === undefined && description === undefined);

  return (
    <StyledNotification color={color} expand={expand} simple={isSimple}>
      <AbsoluteButton position="left">
        <Icon size="md" />
      </AbsoluteButton>
      <StyledHeading as="h6">{title}</StyledHeading>
      {!isSimple && <StyledText as="p">{description}</StyledText>}
      {displayActionButton !== undefined && !isSimple && (
        <StyledButton
          onClick={actionButtonOnClick}
          title={actionButtonLabel!}
          icon={SystemIcons.TrailingIcon}
        >
          {actionButtonLabel}
        </StyledButton>
      )}

      {displayCloseButton !== undefined && !isSimple && (
        <AbsoluteButton position="right">
          <StyledIconButton title="bla" icon={SystemIcons.Close!} />
        </AbsoluteButton>
      )}
    </StyledNotification>
  );
};
