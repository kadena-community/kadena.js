import { SystemIcons } from '../Icons';

import {
  Col,
  Row,
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
  title = 'Notification title',
  description = 'Notification text to inform users about the event that occurred!',
  displayCloseButton = false,
  actionButtonLabel,
  actionButtonOnClick,
  displayActionButton = false,
  color = 'default',
  simplified = false,
  ...props
}) => {
  const Icon = icon!;
  const isSimple = simplified || (!displayActionButton && !description);

  return (
    <StyledNotification
      {...props}
      color={color as any}
      type={isSimple ? 'simple' : 'full'}
    >
      <Row type="masterRow">
        <Col>
          <Icon size="md" color={color} />
        </Col>
        <Col type="body">
          <Row type={isSimple ? 'simple' : 'body'}>
            <StyledHeading as="h6">{title}</StyledHeading>
          </Row>
          <Row>
            {!isSimple && <StyledText as="p">{description}</StyledText>}
          </Row>
          <Row>
            {displayActionButton && (
              <StyledButton
                onClick={actionButtonOnClick}
                title={actionButtonLabel!}
                icon={SystemIcons.TrailingIcon}
              >
                {actionButtonLabel}
              </StyledButton>
            )}{' '}
          </Row>
        </Col>
        <Col>
          {displayCloseButton && (
            <StyledIconButton title="bla" icon={SystemIcons.Close!} />
          )}
        </Col>
      </Row>
    </StyledNotification>
  );
};
