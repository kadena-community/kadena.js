'use client';

import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { GasPayableBanner } from '@/components/GasPayableBanner/GasPayableBanner';
import { Card, Stack, Text } from '@kadena/kode-ui';
import { NotificationSlot } from '@kadena/kode-ui/patterns';
import React from 'react';
import {
  cardClass,
  cardWrapperClass,
  footerClass,
  wrapperClass,
} from './style.css';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Stack
      width="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      className={wrapperClass}
    >
      <Stack>
        <NotificationSlot />
      </Stack>
      <Stack flexDirection="column" className={cardWrapperClass}>
        <Card className={cardClass}>
          <CookieConsent />
          <GasPayableBanner />
          {children}
        </Card>
        <Stack
          className={footerClass}
          width="100%"
          justifyContent="space-between"
          padding="md"
        >
          <Text>
            Powered by{' '}
            <a href="https://kadena.io" target="_blank" rel="noreferrer">
              kadena.io
            </a>
          </Text>

          <Stack gap="md">
            <a href="https://discord.com/invite/kadena">Discord</a>
            <a href="https://docs.kadena.io">Help</a>
            <a href="https://www.kadena.io/privacy-policy">Privacy</a>
            <a href="https://www.kadena.io/terms-and-conditions">Terms</a>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default RootLayout;
