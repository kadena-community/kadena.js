import { updateConsent } from '@/utils/analytics';
import { MonoCheck, MonoClose, MonoCookie } from '@kadena/react-icons';
import {
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
  Text,
} from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { containerClass, notificationWrapperClass } from './styles.css';

export const CookieConsent: FC = () => {
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

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
  }, []);

  const handleReject = useCallback(() => {
    setCookieConsent(false);
  }, []);

  if (cookieConsent !== null || !mounted) return null;

  return (
    <section aria-labelledby="cookie-heading" className={containerClass}>
      <div className={notificationWrapperClass}>
        <Notification
          intent="info"
          type="inlineStacked"
          icon={<MonoCookie />}
          role="none"
        >
          <NotificationHeading id="cookie-heading">
            Cookie Consent
          </NotificationHeading>
          <Text variant="ui">
            This notification concerns the cookie policy requirement to ask
            users for their consent to use <strong>Google Analytics</strong> or
            other tracking tools for better optimizations/performances.
          </Text>
          <NotificationFooter>
            <NotificationButton
              intent={'positive'}
              onClick={handleAccept}
              icon={<MonoCheck />}
            >
              Accept
            </NotificationButton>
            <NotificationButton
              intent={'negative'}
              onClick={handleReject}
              icon={<MonoClose />}
            >
              Reject
            </NotificationButton>
          </NotificationFooter>
        </Notification>
      </div>
    </section>
  );
};
