import {
  Notification,
  NotificationBody,
  styled,
} from '@kadena/react-components';

import { getColor, getIcon, LabelType } from './utils';

import React, { FC, ReactNode } from 'react';

const Wrapper = styled('div', {
  margin: '$5 0',
});

interface IProps {
  children: ReactNode;
  title?: string;
  label?: LabelType;
}

export const MDNotification: FC<IProps> = ({ children, title = '', label }) => {
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
