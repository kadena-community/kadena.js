import {
  INotificationProps,
  Notification,
  NotificationBody,
  styled,
  SystemIcons,
} from '@kadena/react-components';

import React, { FC, ReactNode } from 'react';

const Wrapper = styled('div', {
  margin: '$5 0',
});

type LabelType = 'info' | 'note' | 'tip' | 'caution' | 'danger' | 'warning';
type IconType =
  | (typeof SystemIcons)['Information']
  | (typeof SystemIcons)['Bell']
  | undefined;
interface IProps {
  children: ReactNode;
  title: string;
  label: LabelType;
}

export const MDNotification: FC<IProps> = ({ children, title, label }) => {
  const getColor = (label: LabelType): INotificationProps['color'] => {
    switch (label) {
      case 'note':
      case 'info':
        return 'primary';
      case 'tip':
        return 'positive';
      case 'danger':
      case 'warning':
        return 'negative';
      case 'caution':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getIcon = (label: LabelType): IconType => {
    switch (label) {
      case 'note':
      case 'info':
      case 'tip':
        return SystemIcons.Information;
      case 'caution':
      case 'warning':
      case 'danger':
        return SystemIcons.Bell;

      default:
        return undefined;
    }
  };

  return (
    <Wrapper>
      <Notification
        color={getColor(label)}
        title={title}
        expand
        icon={getIcon(label)}
      >
        <NotificationBody>{children}</NotificationBody>
      </Notification>
    </Wrapper>
  );
};
