import { Notification, NotificationHeading } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import type { IToast } from '../toast-context/toast-context';

interface IProps {
  toast: IToast;
  removeToast: (toast: IToast) => void;
}

const Toast: FC<IProps> = ({ toast, removeToast }) => {
  return (
    <Notification role="status">
      <NotificationHeading>{toast.label}</NotificationHeading>
      {toast.body}
    </Notification>
  );
};

export default Toast;
