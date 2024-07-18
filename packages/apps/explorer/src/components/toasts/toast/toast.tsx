import { MonoWarning } from '@kadena/kode-icons/system';
import {
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
  Stack,
} from '@kadena/kode-ui';
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
    if (toast.permanent) return;

    setTimeout(() => {
      setHide(true);
    }, 10000);
  }, []);

  useEffect(() => {
    if (toast.permanent) return;

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
      <Notification
        isDismissable
        role="alert"
        intent={toast.type}
        onDismiss={() => removeToast(toast)}
      >
        <NotificationHeading>{toast.label}</NotificationHeading>
        {toast.body}

        <NotificationFooter>
          {toast.actionLabel && (
            <NotificationButton
              icon={toast.actionIcon ?? <MonoWarning />}
              intent="negative"
              onClick={toast.action}
            >
              {toast.actionLabel}
            </NotificationButton>
          )}
        </NotificationFooter>
      </Notification>
    </Stack>
  );
};

export default Toast;
