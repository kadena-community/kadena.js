'use client';

import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { GasPayableBanner } from '@/components/GasPayableBanner/GasPayableBanner';
import { Button, ThemeAnimateIcon, useTheme } from '@kadena/kode-ui';
import {
  FocussedLayout,
  FocussedLayoutFooter,
  FocussedLayoutHeaderAside,
  FocussedLayoutProvider,
  FocussedLayoutTopBanner,
} from '@kadena/kode-ui/patterns';
import React from 'react';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { theme, rotateTheme } = useTheme();

  return (
    <>
      <FocussedLayoutProvider>
        <FocussedLayoutTopBanner>
          <CookieConsent />
          <GasPayableBanner />
        </FocussedLayoutTopBanner>
        <FocussedLayout>
          <FocussedLayoutHeaderAside>
            <Button
              isCompact
              variant="transparent"
              onPress={rotateTheme}
              startVisual={<ThemeAnimateIcon theme={theme} />}
            />
          </FocussedLayoutHeaderAside>
          {children}
          <FocussedLayoutFooter />
        </FocussedLayout>
      </FocussedLayoutProvider>
    </>
  );
};

export default RootLayout;
