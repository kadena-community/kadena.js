import { networkConstants } from '@/constants/network';
import { useEffect } from 'react';

export const useRedirectOnNetworkChange = (selectedNetwork: string) => {
  useEffect(() => {
    const mainnetUrl = process.env.NEXT_PUBLIC_EXPLORER_MAINNET_INSTANCE;
    const testnetUrl = process.env.NEXT_PUBLIC_EXPLORER_TESTNET_INSTANCE;

    //TODO Implement redirection when instances are active
    if (selectedNetwork === networkConstants.mainnet01.key) {
      if (mainnetUrl) {
        // window.location.href = mainnetUrl;
      }
    } else if (selectedNetwork === networkConstants.testnet04.key) {
      if (testnetUrl) {
        // window.location.href = testnetUrl;
      }
    }
  }, [selectedNetwork]);
};
