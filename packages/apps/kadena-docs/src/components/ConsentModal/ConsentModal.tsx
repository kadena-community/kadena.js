import {
  Notification,
  NotificationBody,
  NotificationFooter,
  SystemIcons,
} from '@kadena/react-components';
import { Button, Stack, SystemIcon, useModal } from '@kadena/react-ui';

import React, { FC, useEffect } from 'react';

export const ConsentModal: FC = () => {
  const { renderModal } = useModal();

  useEffect(() => {
    console.log(1);
    renderModal(
      <Notification
        displayCloseButton={false}
        color="primary"
        title="Cookie consent"
        icon={SystemIcons.Account}
      >
        <NotificationBody>
          We are using cookies on this website
        </NotificationBody>
        <NotificationFooter>
          <Stack>
            <Button color="primary" title="Accept analytics cookies">
              Accept <SystemIcon.Check />
            </Button>
            <Button color="negative" title="Reject analytics cookies">
              Reject <SystemIcon.Close />
            </Button>
          </Stack>
        </NotificationFooter>
      </Notification>,
    );
  }, []);
  return null;
};
