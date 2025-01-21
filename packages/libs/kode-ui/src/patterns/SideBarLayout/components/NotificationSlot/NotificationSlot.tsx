import { MonoArrowOutward } from '@kadena/kode-icons/system';
import type { FC } from 'react';
import React from 'react';
import { useNotifications } from '../LayoutProvider';
import {
  Link,
  NotificationFooter,
  NotificationHeading,
  Stack,
} from './../../../../components';
import { NotificationWrapper } from './NotificationWrapper';
import { notificationsSlotClass } from './style.css';

export const NotificationSlot: FC = () => {
  const { notifications } = useNotifications();
  const reversedNotifications = [...notifications].reverse();

  return (
    <Stack className={notificationsSlotClass}>
      {reversedNotifications.map((props) => {
        const { label, message } = props;
        return (
          <NotificationWrapper key={props.id} {...props}>
            {label && <NotificationHeading>{label}</NotificationHeading>}
            {message}
            {props.url && (
              <NotificationFooter>
                <Link
                  endVisual={<MonoArrowOutward />}
                  variant={props.intent}
                  href={props.url}
                  target="_blank"
                >
                  Explorer
                </Link>
              </NotificationFooter>
            )}
          </NotificationWrapper>
        );
      })}
    </Stack>
  );
};
