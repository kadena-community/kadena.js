import { useEffect, useState, useRef } from 'react';
import WalletKit, { WalletKitTypes } from '@reown/walletkit';
import { Core } from '@walletconnect/core';

const coreConfig = {
  projectId: '77ef30356b9964645f55fa54c3e83988',
};
const metadata = {
  name: 'Kadena Chainweaver v3',
  description: 'Wallet Connect plugin for Kadena Chainweaver v3',
  url: 'https://chainweaver.kadena.io/',
  icons: [],
};

const useWalletKit = (sessionProposalHandler: (args: WalletKitTypes.SessionProposal) => void, sessionRequestHandler: (args: WalletKitTypes.SessionRequest) => void): [WalletKit | undefined, React.MutableRefObject<WalletKit | undefined>] => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [walletKit, walletKitRef];
}

export default useWalletKit;