import React, { useCallback, useEffect, useState } from 'react';

import {
  Button,
  Heading,
  SystemIcons,
  TextField,
  Notification,
  INotificationProps,
  NotificationBody,
  NotificationFooter,
} from '@kadena/react-components';
import { RequestStatus } from '.';

export interface IFormNotificationProps extends INotificationProps {
  status: RequestStatus;
  body?: string;
}

const statusToColorMapping: Record<RequestStatus, INotificationProps['color']> =
  {
    failed: 'negative',
    pending: 'primary',
    succeeded: 'positive',
    'not started': 'default',
  };

const statusToTitle: Record<RequestStatus, string> = {
  failed: 'Something went wrong',
  pending: 'Transaction is being processed...',
  succeeded: 'Transaction successfully completed',
  'not started': 'Nothing to see here',
};

const statusToBody: Record<RequestStatus, string> = {
  failed: 'Something went wrong',
  pending: 'Still being processed',
  succeeded: 'Great success',
  'not started': 'Nothing to see here',
};

const FormStatusNotification = ({
  body,
  status,
  title,
}: IFormNotificationProps) => {
  const [show, setShow] = useState<boolean>(status !== 'not started');

  useEffect(() => {
    setShow(status !== 'not started');
  }, [status]);

  const onCloseClick = useCallback((event) => {
    event?.preventDefault();
    setShow(false);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <Notification
      color={statusToColorMapping[status]}
      title={title ?? statusToTitle[status]}
      expand
    >
      <NotificationBody>{body ?? statusToBody[status]}</NotificationBody>
      <NotificationFooter>
        <Button
          title="Close notification"
          icon={SystemIcons.Close}
          onClick={onCloseClick}
        >
          Close
        </Button>
      </NotificationFooter>
    </Notification>
  );
};

export default FormStatusNotification;
