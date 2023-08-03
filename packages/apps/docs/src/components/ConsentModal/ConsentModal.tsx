import { Box, Stack, SystemIcon, Text, useModal } from '@kadena/react-ui';

import { consentButtonNegative, consentButtonPositive } from './styles.css';

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
  }, [clearModal]);

  const handleReject = useCallback(() => {
    setCookieConsent(false);
    clearModal();
  }, [clearModal]);

  useEffect(() => {
    if (!mounted) return;
    if (cookieConsent !== null) {
      clearModal();
      return;
    }

    renderModal(
      <>
        <Text>We are using cookies on this website!</Text>
        <Box marginTop="$10">
          <Stack spacing="$4">
            <button
              onClick={handleAccept}
              title="Accept analytics cookies"
              className={consentButtonPositive}
            >
              Accept <SystemIcon.Check />
            </button>
            <button
              onClick={handleReject}
              title="Reject analytics cookies"
              className={consentButtonNegative}
            >
              Reject <SystemIcon.Close />
            </button>
          </Stack>
        </Box>
      </>,

      'Cookie consent',
    );
  }, [
    clearModal,
    cookieConsent,
    mounted,
    handleAccept,
    handleReject,
    renderModal,
  ]);
  return null;
};
