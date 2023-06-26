import {
  Notification,
  NotificationBody,
  NotificationFooter,
  SystemIcons,
} from '@kadena/react-components';
import { Stack, SystemIcon, useModal } from '@kadena/react-ui';

import { ConsentButton } from './ConsentButton';

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
        expand
        displayCloseButton={false}
        color="primary"
        title="Cookie consent"
        icon={SystemIcons.Cookie}
      >
        <NotificationBody>
          We are using cookies on this website!
        </NotificationBody>
        <NotificationFooter>
          <Stack>
            <ConsentButton
              onClick={handleAccept}
              title="Accept analytics cookies"
              color="positive"
            >
              Accept <SystemIcon.Check />
            </ConsentButton>
            <ConsentButton
              onClick={handleReject}
              title="Reject analytics cookies"
              color="negative"
            >
              Reject <SystemIcon.Close />
            </ConsentButton>
          </Stack>
        </NotificationFooter>
      </Notification>,
    );
  }, [cookieConsent, mounted]);
  return null;
};
