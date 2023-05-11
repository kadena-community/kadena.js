import { SystemIcons } from '../Icons';

import {
  AbsoluteButton,
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
  description?: string;
  displayCloseButton?: boolean;
  expand?: VariantProps<typeof StyledNotification>['expand'];

  color?: VariantProps<typeof StyledNotification>['color'];

  simple?: VariantProps<typeof StyledNotification>['simple'];

  buttons?: React.ReactNode;
}

export const Notification: FC<INotificationProps> = ({
  icon,
  title,
  description,
  displayCloseButton,
  color,
  simple,
  expand,
  buttons,
}) => {
  const Icon = icon!;
  const isSimple = simple === 'true' || description === undefined;
  console.log({ displayCloseButton, isSimple });
  return (
    <StyledNotification color={color} expand={expand} simple={isSimple}>
      <AbsoluteButton position="left">
        <Icon size="md" />
      </AbsoluteButton>
      <StyledHeading as="h6">{title}</StyledHeading>
      {!isSimple && <StyledText as="p">{description}</StyledText>}
      {!isSimple && buttons && buttons}

      {displayCloseButton === true && !isSimple && (
        <AbsoluteButton position="right">
          <StyledIconButton title="close-btn" icon={SystemIcons.Close!} />
        </AbsoluteButton>
      )}
    </StyledNotification>
  );
};
