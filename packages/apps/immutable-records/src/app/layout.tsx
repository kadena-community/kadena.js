import { WalletConnectProvider } from '@/connect/connect.context';
import { FC, PropsWithChildren } from 'react';

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
        <body>{children}</body>
      </WalletConnectProvider>
    </html>
  );
};

export default RootLayout;
