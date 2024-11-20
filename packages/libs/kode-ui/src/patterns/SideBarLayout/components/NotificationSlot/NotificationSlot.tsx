import type { FC } from 'react';
import React from 'react';
import { useNotifications } from '../LayoutProvider';
import {
  Notification,
  NotificationHeading,
  Stack,
} from './../../../../components';
import { notificationsSlotClass } from './style.css';

export const NotificationSlot: FC = () => {
  const { notifications } = useNotifications();
  const reversedNotifications = [...notifications].reverse();
  console.log(reversedNotifications);
  return (
    <Stack className={notificationsSlotClass}>
      {reversedNotifications.slice(0, 3).map((props, idx) => {
        const { label, message, ...rest } = props;
        return (
          <Notification key={idx} {...rest}>
            {label && <NotificationHeading>{label}</NotificationHeading>}
            {message}
          </Notification>
        );
      })}
    </Stack>
  );
};
