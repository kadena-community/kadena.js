import { Analytics } from '@/components/Analytics/Analytics';
import { Header } from '@/components/Header/Header';
import { Providers } from '@/components/Providers/Providers';
import { Toasts } from '@/components/Toasts/Toasts';
import type { Metadata } from 'next';
import type { FC, PropsWithChildren } from 'react';
import './global.css';
import { mainWrapperClass } from './style.css';

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
        <Providers>
          <>
            <Header />
            <main className={mainWrapperClass}>
              {children}

              <Toasts />
            </main>
            <Analytics />
          </>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
