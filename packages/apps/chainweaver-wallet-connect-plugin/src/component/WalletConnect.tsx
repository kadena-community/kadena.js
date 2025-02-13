import WalletKit from '@reown/walletkit';
import Core from '@walletconnect/core';
import { useEffect, useState } from 'react';

const core = new Core({
  projectId: '1d8fe1e80daaaf10e5e793df2bffdaab',
});

const metadata = {
  name: 'Kadena Chainweaver v3',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

export const WalletConnect: React.FC<{
  sessionId: string;
  target: Window;
}> = ({ sessionId, target }) => {
  const [walletKit, setWalletKit] = useState<any | undefined>();

  useEffect(() => {
    async function initWalletKit() {
      if (!walletKit) {
        const newWalletKit = await WalletKit.init({
          core, // <- pass the shared 'core' instance
          metadata,
        });
        setWalletKit(newWalletKit);
      }
    }
    initWalletKit();
  }, []);
  return <>{JSON.stringify({ sessionId, target })}</>;
};
