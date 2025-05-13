import type { IAlert, INETWORK } from './constants';
import { sendGraphErrorMessages } from './messages/graph/sendGraphErrorMessages';

interface IChainwebCutResponse {
  hashes: Record<string, { height: number; hash: string }>;
  height: number;
  instance: string;
  id: string;
}

const countHeightOnChainweb = async (
  props: INETWORK,
): Promise<{ totalCutHeight: number; lastBlockHeight: number }> => {
  try {
    const result = await fetch(props.chainweb!);
    const cwCut = (await result.json()) as IChainwebCutResponse;

    return {
      totalCutHeight: cwCut.height,
      lastBlockHeight: propsToArray(cwCut.hashes).reduce(
        (maxHeight, { height }) => Math.max(maxHeight, height),
        0,
      ),
    };
  } catch (e) {
    return {
      totalCutHeight: NaN,
      lastBlockHeight: NaN,
    };
  }
};

function propsToArray<T>(props: Record<string, T>) {
  return Object.keys(props).map((key) => props[key]);
}

interface ICompletedBlockHeightsResponse {
  data: {
    completedBlockHeights: { edges: Array<{ node: { height: number } }> };
  };
}

const testnet04Props: INETWORK = {
  key: 'testnet04',
  label: 'Chainweb testnet',
  chainweb: 'https://ap1.testnet.chainweb.com/chainweb/0.0/testnet04/cut',
  url: 'https://graph.testnet.kadena.network/graphql',
  graphqlRef:
    'https://graph.testnet.kadena.network/graphql?query=query+graphBlockHeight+%7B%0A++++++++completedBlockHeights%28heightCount%3A+1%29+%7B%0A++++++++++edges+%7B%0A++++++++++++node+%7B%0A++++++++++++++height%0A++++++++++++%7D%0A++++++++++%7D%0A++++++++%7D%0A++++++%7D',
} as const;

const mainnet01Props: INETWORK = {
  key: 'mainnet01',
  label: 'Chainweb mainnet',
  chainweb: 'https://api.chainweb.com/chainweb/0.0/mainnet01/cut',
  url: 'https://graph.kadena.network/graphql',
  graphqlRef:
    'https://graph.kadena.network/graphql?query=query+graphBlockHeight+%7B%0A++++++++completedBlockHeights%28heightCount%3A+1%29+%7B%0A++++++++++edges+%7B%0A++++++++++++node+%7B%0A++++++++++++++height%0A++++++++++++%7D%0A++++++++++%7D%0A++++++++%7D%0A++++++%7D',
} as const;

const networks = [testnet04Props, mainnet01Props];

const countHeightOnGraph = async (
  network: INETWORK,
): Promise<{ totalCutHeight: number; lastBlockHeight: number }> => {
  const result = await fetch(network.url, {
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
        completedBlockHeights(heightCount: 1) {
          edges {
            node {
              height
            }
          }
        }
      }`,
      variables: {},
      extensions: {},
    }),
  });

  const completedBlockHeightsResult =
    (await result.json()) as ICompletedBlockHeightsResponse;

  return {
    totalCutHeight:
      completedBlockHeightsResult.data.completedBlockHeights.edges.reduce(
        (acc, { node: { height } }) => acc + height,
        0,
      ),
    lastBlockHeight:
      completedBlockHeightsResult.data.completedBlockHeights.edges.reduce(
        (maxHeight, { node: { height } }) => Math.max(maxHeight, height),
        0,
      ),
  };
};

export const runJobPerEnvironment =
  (alert: IAlert) => async (network: INETWORK) => {
    try {
      const {
        totalCutHeight: totalHeightOnChainWeb,
        lastBlockHeight: lastBlockHeightChainweb,
      } = await countHeightOnChainweb(network);
      const {
        totalCutHeight: totalCutHeightGraph,
        lastBlockHeight: lastBlockHeightGraph,
      } = await countHeightOnGraph(network);

      if (Number.isNaN(totalHeightOnChainWeb)) {
        await sendGraphErrorMessages(alert, network, {
          title: `${network.key} chainweb.com fail`,
          msg: `We were unable to retrieve the blockheights from chainweb. \n There seems to be an issue with ChainWeb (${network.chainweb})`,
        });
        return;
      }
      if (Number.isNaN(totalCutHeightGraph)) {
        await sendGraphErrorMessages(alert, network, {
          title: `${network.key} graph fail`,
          msg: `We were unable to retrieve the blockheights from the test graph. \n There seems to be an issue with test graph (${network.url})`,
        });
        return;
      }

      if (
        Math.abs(totalHeightOnChainWeb - totalCutHeightGraph) >
        alert.options?.maxblockHeightDiff!
      ) {
        await sendGraphErrorMessages(alert, network, {
          title: `${network.key} chainweb and graph blockheight difference`,
          msg: `There is a large difference in the totalCutHeight between ${network.key} chainweb and graph.

Total cut height difference: ${Math.abs(totalHeightOnChainWeb - totalCutHeightGraph)}

[Chainweb lastBlockHeight](${network.chainweb}): ${lastBlockHeightChainweb}
[GraphiQL lastBlockHeight](${network.graphqlRef}): ${lastBlockHeightGraph}
Total height difference: ${lastBlockHeightChainweb - lastBlockHeightGraph}
`,
        });
      }
    } catch (e) {
      await sendGraphErrorMessages(alert, network, {
        title: `There was a general issue with the ${network.key} graph cron job`,
        msg: JSON.stringify(e),
      });
    }
  };

export const graphAlert = async (alert: IAlert): Promise<string[]> => {
  const results = await Promise.all(networks.map(runJobPerEnvironment(alert)));

  return results.filter((v) => v !== undefined);
};
