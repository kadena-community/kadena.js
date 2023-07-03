import {
  Button,
  INotificationProps,
  Notification,
  NotificationBody,
  NotificationFooter,
  styled,
  SystemIcons,
} from '@kadena/react-components';

import { RequestStatus } from '.';

import React, {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';

type FormNotificationProps = Pick<INotificationProps, 'title'> & {
  status: RequestStatus;
  body?: string;
};

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
  failed: 'Something went wrong.',
  pending:
    'Please have some patience while the transaction is being processed.',
  succeeded: 'The coins have been funded to the given account.',
  'not started': 'Nothing to see here.',
};

const Container = styled('div', {
  marginBottom: '1.5rem', // 24px
  width: '100%',
  maxWidth: '100%',
});

const FormStatusNotification: FC<FormNotificationProps> = ({
  body,
  status,
  title,
}) => {
  const [show, setShow] = useState<boolean>(status !== 'not started');

  useEffect(() => {
    setShow(status !== 'not started');
  }, [status]);

  const onCloseClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      event.preventDefault();
      setShow(false);
    },
    [],
  );

  if (!show) {
    return null;
  }

  return (
    <Container>
      <Notification
        color={statusToColorMapping[status]}
        title={title ?? statusToTitle[status]}
        icon={SystemIcons.Information}
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
    </Container>
  );
};

export default FormStatusNotification;
