import { Notification, Text } from '@kadena/react-ui';

import { notificationClass } from './styles.css';

import { updateConsent } from '@/utils/analytics';
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';

export const CookieConsent: FC = () => {
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);

  useEffect(() => {
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

  if (cookieConsent !== null) return null;

  return (
    <div className={notificationClass}>
      <Notification.Root
        title="Cookie Consent"
        color="info"
        expanded
        variant="standard"
        icon="Cookie"
      >
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
    </div>
  );
};
