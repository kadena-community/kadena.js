import { COOKIE_CONSENTNAME, updateConsent } from '@/utils/analytics';
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';

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
    <div>
      <div>
        <h3>Cookie consent</h3>
        <p>
          This notification concerns the cookie policy requirement to ask users
          for their consent to use <strong>Google Analytics</strong> or other
          tracking tools for better optimizations/performances.
        </p>
        <div>
          <button onClick={handleAccept}>Accept</button>
          <button onClick={handleReject}>Reject</button>
        </div>
      </div>
    </div>
  );
};
