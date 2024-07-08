import { useRouter } from '@/components/routing/useRouter';
import type { INetwork } from '@/context/networks-context';
import { selectedNetworkKey, useNetwork } from '@/context/networks-context';
import React, { useEffect } from 'react';

const Home: React.FC = () => {
  const router = useRouter();
  const { setActiveNetwork, networks } = useNetwork();

  useEffect(() => {
    if (!localStorage.getItem(selectedNetworkKey)) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.replace(`/${networks[0].networkId}`);
      return;
    }
    const network: INetwork = JSON.parse(
      localStorage.getItem(selectedNetworkKey) ?? '{}',
    );

    if (!network) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.replace(`/`);
      return;
    }

    setActiveNetwork(network.networkId);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace(`/${network.networkId}`);
  }, [router.asPath]);

  return <div>rerouting</div>;
};

export default Home;
