import { selectedNetworkKey } from '@/context/networksContext';
import type { GetServerSideProps } from 'next';
import type React from 'react';

const Home: React.FC = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const DEFAULTNETWORKSLUG = 'mainnet';
  if (!ctx.req.headers.cookie) {
    return {
      redirect: {
        permanent: false,
        destination: `/${DEFAULTNETWORKSLUG}`,
      },
    };
  }
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

  const network = cookieValues[selectedNetworkKey] ?? {
    value: DEFAULTNETWORKSLUG,
  };

  return {
    redirect: {
      permanent: false,
      destination: `/${network.value}`,
    },
  };
};

export default Home;
