'use client';

import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { useUser } from '@/hooks/user';
import { shortenString } from '@/utils/shortenString';
import { MonoAccountCircle } from '@kadena/kode-icons';
import {
  Button,
  ThemeAnimateIcon,
  Link as UILink,
  useTheme,
} from '@kadena/kode-ui';
import {
  FocussedLayout,
  FocussedLayoutFooter,
  FocussedLayoutHeaderAside,
  FocussedLayoutProvider,
  FocussedLayoutTopBanner,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import React from 'react';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { theme, rotateTheme } = useTheme();
  const { user, signInByGoogle } = useUser();

  return (
    <>
      <FocussedLayoutProvider>
        <FocussedLayoutTopBanner>
          <CookieConsent />
        </FocussedLayoutTopBanner>
        <FocussedLayout>
          <FocussedLayoutHeaderAside>
            {user?.id ? (
              <UILink
                component={Link}
                href={`/dashboard`}
                isCompact
                variant="transparent"
              >
                {shortenString(user?.user_metadata.full_name)}
              </UILink>
            ) : (
              <Button
                onPress={signInByGoogle}
                isCompact
                variant="transparent"
                startVisual={<MonoAccountCircle />}
              >
                Login
              </Button>
            )}
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
