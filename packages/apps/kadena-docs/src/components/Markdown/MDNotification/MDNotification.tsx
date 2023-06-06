import {
  Notification,
  NotificationBody,
  styled,
  SystemIcons,
} from '@kadena/react-components';

import React, { FC, ReactNode } from 'react';

const Wrapper = styled('div', {
  margin: '$5 0',
});

interface IProps {
  children: ReactNode;
  title: string;
  label: 'info' | 'note' | 'tip' | 'caution' | 'danger' | 'warning';
}

export const MDNotification: FC<IProps> = ({ children, title, label }) => {
  return (
    <Wrapper>
      <Notification title={title} expand icon={SystemIcons.Account}>
        <NotificationBody>{children}</NotificationBody>
      </Notification>
    </Wrapper>
  );
};
