import type { FC, PropsWithChildren } from 'react';

import { AccountInfo } from '@/components/AccountInfo/AccountInfo';
import { AccountProvider } from '@/components/AccountProvider/AccountProvider';
import { Analytics } from '@/components/Analytics/Analytics';
import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import { ToastProvider } from '@/components/ToastProvider/ToastProvider';
import { Toasts } from '@/components/Toasts/Toasts';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  //@TODO get year from somewhere

  const title = 'Proof of Us | Kadena';
  const description = '';

  return {
    title: `${title}`,
    description,
    icons: {
      icon: '/assets/favicons/light/icon@32.png',
      shortcut: '/assets/favicons/light/icon@32.png',
      other: [
        {
          rel: 'apple-touch-icon',
          url: '/assets/favicons/dark/icon@192.png',
        },
        {
          rel: 'icon',
          url: '/favicons/internal/light/icon@32.png',
          sizes: '32x32',
          media: ' media="(prefers-color-scheme: light)"',
        },
        {
          rel: 'icon',
          url: '/favicons/internal/dark/icon@32.png',
          sizes: '32x32',
          media: ' media="(prefers-color-scheme: dark)"',
        },
        {
          rel: 'icon',
          url: '/favicons/internal/light/icon@128.png',
          sizes: '128x128',
          media: ' media="(prefers-color-scheme: light)"',
        },
        {
          rel: 'icon',
          url: '/favicons/internal/dark/icon@128.png',
          sizes: '128x128',
          media: ' media="(prefers-color-scheme: dark)"',
        },
        {
          rel: 'icon',
          url: '/favicons/internal/light/icon@192.png',
          sizes: '192x192',
          media: ' media="(prefers-color-scheme: light)"',
        },
        {
          rel: 'icon',
          url: '/favicons/internal/dark/icon@192.png',
          sizes: '192x192',
          media: ' media="(prefers-color-scheme: dark)"',
        },
      ],
    },
  };
}

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html>
      <body>
        <ToastProvider>
          <AccountProvider>
            <ThemeProvider>
              <>
                <AccountInfo />
                {children}

                <CookieConsent />

                <Toasts />
                <Analytics />
              </>
            </ThemeProvider>
          </AccountProvider>
        </ToastProvider>
      </body>
    </html>
  );
};

export default RootLayout;
