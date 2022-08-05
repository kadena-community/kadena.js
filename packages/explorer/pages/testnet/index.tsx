import React from 'react';
import { unstable_serialize } from 'swr';
import { GetServerSidePropsContext } from 'next';
import { BlocksContext, useBlocksState } from 'services/app';
import Layout from '../../components/common/Layout/Layout';
import LatestTable from '../../components/common/Home/components/LatestTable/LatestTable';
import {
  nodeInfoAsync,
  useNodeInfo,
  withFallbackApiData,
} from '../../services/api';
import { APIRoute } from '../../config/Routes';
import { NetworkName } from '../../utils/api';
import { setCookieStatic } from '../../utils/cookie';
import Main from '../../components/common/Home/components/Main/Main';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    await setCookieStatic(context, 'network', NetworkName.TEST_NETWORK);
    const nodeInfoData = await nodeInfoAsync(
      APIRoute.Info,
      NetworkName.TEST_NETWORK,
    );
    return {
      props: {
        fallbackApiData: {
          [unstable_serialize([APIRoute.Info, NetworkName.TEST_NETWORK])]:
            nodeInfoData,
        },
      },
    };
  } catch (error) {
    console.error(error || 'Error');
    return { props: { hasError: true } };
  }
}

const TestNetHome = () => {
  const nodeInfo = useNodeInfo(NetworkName.TEST_NETWORK);

  const blockState = useBlocksState(NetworkName.TEST_NETWORK, nodeInfo);

  return (
    <Layout>
      <BlocksContext.Provider value={blockState}>
        <Main network={NetworkName.TEST_NETWORK} nodeInfo={nodeInfo} />
        <LatestTable network={NetworkName.TEST_NETWORK} />
      </BlocksContext.Provider>
    </Layout>
  );
};

export default withFallbackApiData(TestNetHome);
