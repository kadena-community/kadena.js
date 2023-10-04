import { bodyClass } from './layout.css';

import { WalletConnectProvider } from '@/context/connect.context';
import localFont from 'next/font/local';
import type { FC, PropsWithChildren } from 'react';

const monoFont = localFont({
  src: '../../public/fonts/KodeMono.woff2',
  display: 'swap',
});

export const metadata = {
  title: 'Immutable Records',
  description: 'Immutable Records',
};

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID!;
const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL!;

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <WalletConnectProvider projectId={PROJECT_ID} relayUrl={RELAY_URL}>
        <body className={`${bodyClass} ${monoFont.className}`}>{children}</body>
      </WalletConnectProvider>
    </html>
  );
};

export default RootLayout;
