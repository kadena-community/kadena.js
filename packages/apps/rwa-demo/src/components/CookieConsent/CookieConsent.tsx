import { updateConsent } from '@/utils/analytics';
import { MonoCheck, MonoClose, MonoCookie } from '@kadena/kode-icons';
import {
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
  Text,
} from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useCallback, useState } from 'react';
export const CookieConsent: FC = () => {
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(() => {
    const stickyValue = localStorage.getItem('cookie_consent');
    if (stickyValue === null) return null;

    const booleanValue = JSON.parse(stickyValue);

    updateConsent(booleanValue);
    return booleanValue;
  });

  const handleAccept = useCallback(() => {
    setCookieConsent(true);
    updateConsent(true);
  }, []);

  const handleReject = useCallback(() => {
    setCookieConsent(false);
    updateConsent(false);
  }, []);

  if (cookieConsent !== null) return null;

  return (
    <Notification
      intent="info"
      type="inlineStacked"
      icon={<MonoCookie />}
      role="none"
      contentMaxWidth={1000}
    >
      <NotificationHeading id="cookie-heading">
        Cookie Consent
      </NotificationHeading>
      <Text variant="ui">
        This notification concerns the cookie policy requirement to ask users
        for their consent to use <strong>Google Analytics</strong> or other
        tracking tools for better optimizations/performances.
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
  );
};
