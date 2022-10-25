import LatestTable from '../components/common/Home/components/LatestTable/LatestTable';
import Main from '../components/common/Home/components/Main/Main';
import Layout from '../components/common/Layout/Layout';
import { APIRoute } from '../config/Routes';
import {
  nodeInfoAsync,
  useNodeInfo,
  withFallbackApiData,
} from '../services/api';
import { BlocksContext, NetworkContext, useBlocksState } from '../services/app';
import { getNetworkCookie } from '../utils/cookie';

import { GetServerSidePropsContext } from 'next';
import React, { FC, useContext } from 'react';
import { unstable_serialize } from 'swr';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const network = getNetworkCookie(context);
    const nodeInfoData = await nodeInfoAsync(APIRoute.Info, network);

    return {
      props: {
        fallbackApiData: {
          [unstable_serialize([APIRoute.Info, network])]: nodeInfoData,
        },
      },
    };
  } catch (error) {
    console.error(error || 'Error');
    return { props: { hasError: true } };
  }
}

const Home: FC = () => {
  const { network } = useContext(NetworkContext);
  const nodeInfo = useNodeInfo(network);

  const blockState = useBlocksState(network, nodeInfo);

  return (
    <Layout>
      <BlocksContext.Provider value={blockState}>
        <Main network={network} nodeInfo={nodeInfo} />
        <LatestTable network={network} />
      </BlocksContext.Provider>
    </Layout>
  );
};

export default withFallbackApiData(Home);
