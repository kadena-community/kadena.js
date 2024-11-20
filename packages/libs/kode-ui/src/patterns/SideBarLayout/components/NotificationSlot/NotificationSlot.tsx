import type { FC } from 'react';
import React from 'react';
import { useNotifications } from '../LayoutProvider';
import { NotificationHeading, Stack } from './../../../../components';
import { NotificationWrapper } from './NotificationWrapper';
import { notificationsSlotClass } from './style.css';

export const NotificationSlot: FC = () => {
  const { notifications } = useNotifications();
  const reversedNotifications = [...notifications].reverse();
  console.log(reversedNotifications);
  return (
    <Stack className={notificationsSlotClass}>
      {reversedNotifications.map((props) => {
        const { label, message } = props;
        return (
          <NotificationWrapper key={props.id} {...props}>
            {label && <NotificationHeading>{label}</NotificationHeading>}
            {message}
          </NotificationWrapper>
        );
      })}
    </Stack>
  );
};
