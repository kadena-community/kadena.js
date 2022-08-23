import React, { useContext } from 'react';
import { unstable_serialize } from 'swr';
import { GetServerSidePropsContext } from 'next';
import Layout from '../components/common/Layout/Layout';
import LatestTable from '../components/common/Home/components/LatestTable/LatestTable';
import {
  nodeInfoAsync,
  useNodeInfo,
  withFallbackApiData,
} from '../services/api';
import { APIRoute } from '../config/Routes';
import { getNetworkCookie } from '../utils/cookie';
import Main from '../components/common/Home/components/Main/Main';
import { BlocksContext, NetworkContext, useBlocksState } from '../services/app';

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

const Home = () => {
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
