import { Notification, NotificationHeading, Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { hideAnimationClass, notificationClass } from '../style.css';
import type { IToast } from '../toast-context/toast-context';

interface IProps {
  toast: IToast;
  removeToast: (toast: IToast) => void;
  idx: number;
}

const Toast: FC<IProps> = ({ toast, removeToast, idx }) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHide(true);
    }, 10000);
  }, []);

  useEffect(() => {
    if (!hide) return;
    setTimeout(() => {
      setHide(false);
      removeToast(toast);
    }, 1000);
  }, [hide]);

  return (
    <Stack
      className={classNames(notificationClass, {
        [hideAnimationClass]: hide,
      })}
    >
      <Notification role="status">
        <NotificationHeading>{toast.label}</NotificationHeading>
        {toast.body}
      </Notification>
    </Stack>
  );
};

export default Toast;
