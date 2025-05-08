'use client';

import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { DemoBanner } from '@/components/DemoBanner/DemoBanner';
import { GasPayableBanner } from '@/components/GasPayableBanner/GasPayableBanner';
import { GraphOnlineBanner } from '@/components/GraphOnlineBanner/GraphOnlineBanner';
import { MonoDarkMode, MonoLightMode } from '@kadena/kode-icons';
import { Button, Card, Stack, Themes, useTheme } from '@kadena/kode-ui';
import {
  FocussedLayout,
  FocussedLayoutFooter,
  FocussedLayoutHeaderAside,
  FocussedLayoutProvider,
  FocussedLayoutTopBanner,
} from '@kadena/kode-ui/patterns';
import React from 'react';
import { cardClass, focussedLayoutChildrenWrapperClass } from './style.css';

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
    <FocussedLayoutProvider>
      <FocussedLayoutTopBanner>
        <DemoBanner />
        <CookieConsent />
        <GraphOnlineBanner />
        <GasPayableBanner />
      </FocussedLayoutTopBanner>
      <FocussedLayoutHeaderAside>
        <Button
          isCompact
          variant="transparent"
          onPress={() => toggleTheme()}
          startVisual={theme === 'dark' ? <MonoDarkMode /> : <MonoLightMode />}
        />
      </FocussedLayoutHeaderAside>
      <FocussedLayout>
        <Stack className={focussedLayoutChildrenWrapperClass}>
          <Card className={cardClass}>{children}</Card>
        </Stack>
        <FocussedLayoutFooter />
      </FocussedLayout>
    </FocussedLayoutProvider>
  );
};

export default RootLayout;
