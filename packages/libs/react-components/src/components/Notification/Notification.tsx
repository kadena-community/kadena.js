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
  icon?: typeof SystemIcons[keyof typeof SystemIcons];

  title: string;
  description?: string;
  displayCloseButton?: boolean;
  expand?: VariantProps<typeof StyledNotification>['expand'];

  color?: VariantProps<typeof StyledNotification>['color'];

  simple?: VariantProps<typeof StyledNotification>['simple'];

  footerContent?: React.ReactNode;
}

export const Notification: FC<INotificationProps> = ({
  icon,
  title,
  description,
  displayCloseButton,
  color,
  simple,
  expand,
  footerContent,
}) => {
  const Icon = icon!;
  const isSimple = (simple as boolean) || description === undefined;
  return (
    <StyledNotification color={color} expand={expand} simple={isSimple}>
      <StyledIconButton
        position="left"
        color={color as IIconButtonProps['color']}
        title="icon"
        icon={Icon}
      />

      <StyledHeading as="h6">{title}</StyledHeading>
      {!isSimple && <StyledText as="p">{description}</StyledText>}
      {!isSimple && footerContent}

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
