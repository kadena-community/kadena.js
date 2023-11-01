import type { INotificationProps } from '@kadena/react-ui';
import { Notification } from '@kadena/react-ui';
import React from 'react';

export interface ICloseableNotificationProps
  extends Omit<INotificationProps, 'hasCloseButton'> {}

export const CloseableNotification = ({
  onClose,
  ...rest
}: Omit<INotificationProps, 'hasCloseButton'>) => {
  const [show, setShow] = React.useState(true);
  if (!show) return null;
  return (
    <Notification.Root
      hasCloseButton
      onClose={() => {
        onClose?.();
        setShow(false);
      }}
      {...rest}
    />
  );
};
