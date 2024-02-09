'use client';

import { COOKIE_CONSENTNAME, updateConsent } from '@/utils/analytics';
import {
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
  SystemIcon,
  Text,
} from '@kadena/react-ui';
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { notificationWrapperClass } from './styles.css';

export const CookieConsent: FC = () => {
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const stickyValue = localStorage.getItem(COOKIE_CONSENTNAME);
    if (stickyValue === null) return;
    setCookieConsent(Boolean(stickyValue));
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
    <div className={notificationWrapperClass}>
      <Notification
        intent="info"
        displayStyle="borderless"
        icon={<SystemIcon.Cookie />}
        role="none"
      >
        <NotificationHeading id="cookie-heading">
          Cookie Consent
        </NotificationHeading>
        <Text>
          This notification concerns the cookie policy requirement to ask users
          for their consent to use <strong>Google Analytics</strong> or other
          tracking tools for better optimizations/performances.
        </Text>

        <NotificationFooter>
          <NotificationButton
            intent={'positive'}
            onClick={handleAccept}
            icon={<SystemIcon.Check />}
          >
            Accept
          </NotificationButton>
          <NotificationButton
            intent={'negative'}
            onClick={handleReject}
            icon={<SystemIcon.Close />}
          >
            Reject
          </NotificationButton>
        </NotificationFooter>
      </Notification>
    </div>
  );
};
