import { useEffect, useState, useRef } from 'react';
import WalletKit from '@reown/walletkit';
import { Core } from '@walletconnect/core';

const coreConfig = {
  projectId: '77ef30356b9964645f55fa54c3e83988',
};
const metadata = {
  name: 'Kadena Chainweaver v3',
  description: 'AppKit Example',
  url: 'http://localhost:4173/',
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

const useWalletKit = (sessionProposalHandler: any, sessionRequestHandler: any): [WalletKit | undefined, React.MutableRefObject<WalletKit | undefined>] => {
  const [walletKit, setWalletKit] = useState<WalletKit | undefined>();
  const walletKitRef = useRef(walletKit);

  useEffect(() => {
    const core = new Core(coreConfig);
    async function initializeWalletKit() {
      const newWalletKit = await WalletKit.init({
        core,
        metadata,
      });

      // Subscribe to events
      newWalletKit.on('session_proposal', sessionProposalHandler);
      newWalletKit.on('session_request', sessionRequestHandler);

      setWalletKit(newWalletKit);
      walletKitRef.current = newWalletKit;
    }

    if (!walletKitRef.current) {
      initializeWalletKit();
    }
  }, []);

  return [walletKit, walletKitRef];
}

export default useWalletKit;