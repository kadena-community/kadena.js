'use client';

import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { GasPayableBanner } from '@/components/GasPayableBanner/GasPayableBanner';
import { MonoDarkMode, MonoLightMode } from '@kadena/kode-icons';
import { Button, Themes } from '@kadena/kode-ui';
import {
  FocussedLayout,
  FocussedLayoutFooter,
  FocussedLayoutHeaderAside,
  FocussedLayoutProvider,
  FocussedLayoutTopBanner,
} from '@kadena/kode-ui/patterns';
import { useTheme } from 'next-themes';
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
              startVisual={
                theme === 'dark' ? <MonoDarkMode /> : <MonoLightMode />
              }
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
