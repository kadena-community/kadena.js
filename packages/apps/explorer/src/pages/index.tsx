import { selectedNetworkKey } from '@/context/networks-context';
import type { GetServerSideProps } from 'next';
import type React from 'react';

const Home: React.FC = () => {
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
