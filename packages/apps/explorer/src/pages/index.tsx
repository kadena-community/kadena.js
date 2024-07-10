import { useRouter } from '@/components/routing/useRouter';
import type { INetwork } from '@/context/networks-context';
import { selectedNetworkKey, useNetwork } from '@/context/networks-context';
import Cookies from 'js-cookie';
import type { GetServerSideProps } from 'next';
import type React from 'react';
import { useEffect } from 'react';

const Home: React.FC = () => {
  const router = useRouter();
  const { setActiveNetwork, networks } = useNetwork();

  // useEffect(() => {
  //   if (!localStorage.getItem(selectedNetworkKey)) {
  //     // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //     router.replace(`/${networks[0].networkId}`);
  //     return;
  //   }
  //   const network: INetwork = JSON.parse(
  //     localStorage.getItem(selectedNetworkKey) ?? '{}',
  //   );

  //   if (!network) {
  //     // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //     router.replace(`/`);
  //     return;
  //   }

  //   setActiveNetwork(network.networkId);
  //   // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //   router.replace(`/${network.networkId}`);
  // }, [router.asPath]);

  return null;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookieValues = ctx.req.headers
    .cookie!.split(';')
    .reduce<Record<string, { key: string; value: string }>>((acc, val) => {
      const [key, value] = val.split('=');
      acc[key.trim()] = {
        key: key.trim(),
        value: value.trim(),
      };
      return acc;
    }, {});

  const network = cookieValues[selectedNetworkKey] ?? { value: 'mainnet01' };

  return {
    redirect: {
      permanent: false,
      destination: `/${network.value}`,
    },
  };
};

export default Home;
