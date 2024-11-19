import { MAXBLOCKHEIGHT_DIFFERENCE } from '../constants';
import { sendErrorMessage } from './messages';

const countHeightOnChainweb = async (): Promise<number> => {
  try {
    const result = await fetch(
      'https://ap1.testnet.chainweb.com/chainweb/0.0/testnet04/cut',
    );
    const data: any = await result.json();
    return Object.entries(data.hashes)
      .map(([key, val]) => val)
      .reduce((acc: number, val: any) => {
        return acc + val.height;
      }, 0);
  } catch (e) {
    return parseInt('no Number');
  }
};

const countHeightOnGraph = async (): Promise<number> => {
  const result = await fetch('https://graph.testnet.kadena.network/graphql', {
    method: 'POST',
    headers: {
      accept:
        'application/graphql-response+json, application/json, multipart/mixed',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pragma: 'no-cache',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
    },
    body: JSON.stringify({
      query: `query graphBlockHeight {
            lastBlockHeight
      }`,
      variables: {},
      extensions: {},
    }),
  });

  const data = (await result.json()) as any;
  return data.data.lastBlockHeight * 20;
};

export const runJob = async () => {
  try {
    const totalHeightOnChainWeb = await countHeightOnChainweb();
    const totalHeightOnGraph = await countHeightOnGraph();

    if (Number.isNaN(totalHeightOnChainWeb)) {
      await sendErrorMessage({
        title: 'ap1.testnet.chainweb.com fail',
        msg: 'We were unable to retrieve the blockheights from chainweb. \n There seems to be an issue with ChainWeb (https://ap1.testnet.chainweb.com/chainweb/0.0/testnet04/cut)',
      });
      return;
    }
    if (Number.isNaN(totalHeightOnGraph)) {
      await sendErrorMessage({
        title: 'graph.testnet fail',
        msg: 'We were unable to retrieve the blockheights from the test graph. \n There seems to be an issue with test graph (https://graph.testnet.kadena.network/graphql)',
      });
      return;
    }

    if (
      Math.abs(totalHeightOnChainWeb - totalHeightOnGraph) >
      MAXBLOCKHEIGHT_DIFFERENCE
    ) {
      await sendErrorMessage({
        title: 'graph.testnet issue',
        msg: `There is a large difference in the last blockheight between testnet.chainweb and graph.testnet. \n difference: ${Math.abs(totalHeightOnChainWeb - totalHeightOnGraph)}`,
      });
    }
  } catch (e) {
    await sendErrorMessage({
      title: 'There was a general issue with the test.graph cron job',
      msg: ``,
    });
  }
};
