import { SystemIcons } from '../Icons';

import {
  AbsoluteButton,
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

  color?: string;

  simplified?: boolean;
}

export const Notification: FC<INotificationProps> = ({
  icon,
  title,
  description,
  displayCloseButton = false,
  actionButtonLabel,
  actionButtonOnClick,
  displayActionButton = false,
  color = 'default',
  simplified = false,
  ...props
}) => {
  const Icon = icon!;
  const isSimple =
    simplified || (!displayActionButton && description === undefined)
      ? true
      : false;

  return (
    <StyledNotification
      {...props}
      // eslint-disable-next-line
      color={color as any}
      type={isSimple ? 'simple' : 'full'}
    >
      <AbsoluteButton position="left">
        <Icon size="md" color={color} />
      </AbsoluteButton>
      <StyledHeading as="h6">{title}</StyledHeading>
      {!isSimple && <StyledText as="p">{description}</StyledText>}
      {displayActionButton && !isSimple && (
        <StyledButton
          onClick={actionButtonOnClick}
          title={actionButtonLabel!}
          icon={SystemIcons.TrailingIcon}
        >
          {actionButtonLabel}
        </StyledButton>
      )}
      <AbsoluteButton position="right">
        {displayCloseButton && !isSimple && (
          <StyledIconButton title="bla" icon={SystemIcons.Close!} />
        )}
      </AbsoluteButton>
    </StyledNotification>
  );
};
