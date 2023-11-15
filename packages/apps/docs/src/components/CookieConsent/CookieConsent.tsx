import { updateConsent } from '@/utils/analytics';
import { Notification, SystemIcon, Text } from '@kadena/react-ui';
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { notificationClass } from './styles.css';

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
    <section aria-labelledby="cookie-heading" className={notificationClass}>
      <Notification.Root
        color="info"
        styleVariant="borderless"
        icon={<SystemIcon.Cookie />}
        role="none"
      >
        <Notification.Heading id="cookie-heading">
          Cookie Consent
        </Notification.Heading>
        <Text>
          This notification concerns the cookie policy requirement to ask users
          for their consent to use <strong>Google Analytics</strong> or other
          tracking tools for better optimizations/performances.
        </Text>
        <Notification.Actions>
          <Notification.Button
            icon="Check"
            color={'positive'}
            onClick={handleAccept}
          >
            Accept
          </Notification.Button>
          <Notification.Button
            icon="Close"
            color={'negative'}
            onClick={handleReject}
          >
            Reject
          </Notification.Button>
        </Notification.Actions>
      </Notification.Root>
    </section>
  );
};
