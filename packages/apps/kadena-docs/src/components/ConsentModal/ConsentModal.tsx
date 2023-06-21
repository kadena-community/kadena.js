import {
  Notification,
  NotificationBody,
  NotificationFooter,
  SystemIcons,
} from '@kadena/react-components';
import { Button, Stack, SystemIcon, useModal } from '@kadena/react-ui';

import { updateConsent } from '@/utils/analytics';
import React, { FC, useCallback, useEffect, useState } from 'react';

export const ConsentModal: FC = () => {
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const { renderModal, clearModal } = useModal();

  useEffect(() => {
    setMounted(true);
    const stickyValue = localStorage.getItem('cookie_consent');
    if (stickyValue === null) return;
    setCookieConsent(JSON.parse(stickyValue));
  }, []);

  useEffect(() => {
    if (cookieConsent === null) return;
    updateConsent(cookieConsent);
  }, [cookieConsent]);

  const handleAccept = useCallback(() => {
    setCookieConsent(true);
    clearModal();
  }, []);

  const handleReject = useCallback(() => {
    setCookieConsent(false);
    clearModal();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (cookieConsent !== null) {
      clearModal();
      return;
    }

    renderModal(
      <Notification
        displayCloseButton={false}
        color="primary"
        title="Cookie consent"
        icon={SystemIcons.Cookie}
      >
        <NotificationBody>
          We are using cookies on this website
        </NotificationBody>
        <NotificationFooter>
          <Stack>
            <Button
              onClick={handleAccept}
              color="primary"
              title="Accept analytics cookies"
            >
              Accept <SystemIcon.Check />
            </Button>
            <Button
              onClick={handleReject}
              color="negative"
              title="Reject analytics cookies"
            >
              Reject <SystemIcon.Close />
            </Button>
          </Stack>
        </NotificationFooter>
      </Notification>,
    );
  }, [cookieConsent, mounted]);
  return null;
};
