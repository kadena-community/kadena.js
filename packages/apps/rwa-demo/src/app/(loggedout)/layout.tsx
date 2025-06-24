'use client';

import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { GasPayableBanner } from '@/components/GasPayableBanner/GasPayableBanner';
import { ThemeAnimateIcon } from '@/components/ThemeAnimateIcon/ThemeAnimateIcon';
import { Button, Themes, useTheme } from '@kadena/kode-ui';
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
  const { theme, setTheme } = useTheme();

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

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
              onPress={() => toggleTheme()}
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
