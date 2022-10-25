import LatestTable from 'components/common/Home/components/LatestTable/LatestTable';
import Main from 'components/common/Home/components/Main/Main';
import Layout from 'components/common/Layout/Layout';
import { APIRoute } from 'config/Routes';
import { GetServerSidePropsContext } from 'next';
import React, { FC } from 'react';
import { nodeInfoAsync, useNodeInfo, withFallbackApiData } from 'services/api';
import { BlocksContext, useBlocksState } from 'services/app';
import { unstable_serialize } from 'swr';
import { NetworkName, setCookieStatic } from 'utils';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    setCookieStatic(context, 'network', NetworkName.MAIN_NETWORK);
    const nodeInfoData = await nodeInfoAsync(
      APIRoute.Info,
      NetworkName.MAIN_NETWORK,
    );

    return {
      props: {
        fallbackApiData: {
          [unstable_serialize([APIRoute.Info, NetworkName.MAIN_NETWORK])]:
            nodeInfoData,
        },
      },
    };
  } catch (error) {
    console.error(error || 'Error');
    return { props: { hasError: true } };
  }
}

const MainNetHome: FC = () => {
  const nodeInfo = useNodeInfo(NetworkName.MAIN_NETWORK);

  const blockState = useBlocksState(NetworkName.MAIN_NETWORK, nodeInfo);

  return (
    <Layout>
      <BlocksContext.Provider value={blockState}>
        <Main network={NetworkName.MAIN_NETWORK} nodeInfo={nodeInfo} />
        <LatestTable network={NetworkName.MAIN_NETWORK} />
      </BlocksContext.Provider>
    </Layout>
  );
};

export default withFallbackApiData(MainNetHome);
