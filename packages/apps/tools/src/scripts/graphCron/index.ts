import { MAXBLOCKHEIGHT_DIFFERENCE } from '../constants';
import { sendErrorMessage } from './messages';

interface IEnvProps {
  env: 'testnet04' | 'mainnet01';
  chainweb: string;
  graphql: string;
  graphqlRef: string;
}

interface IChainwebCutResponse {
  hashes: Record<string, { height: number; hash: string }>;
  height: number;
  instance: string;
  id: string;
}

const countHeightOnChainweb = async (
  props: IEnvProps,
): Promise<{ totalCutHeight: number; lastBlockHeight: number }> => {
  try {
    const result = await fetch(props.chainweb);
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

function log<T extends unknown>(msg: T, prepend: string = ''): T {
  prepend = prepend.length > 0 ? `${prepend}\n` : prepend;
  if (typeof msg !== 'string') {
    console.log('LOG:', prepend + JSON.stringify(msg, null, 2));
  } else {
    console.log('LOG:', prepend + msg);
  }
  return msg;
}

const countHeightOnGraph = async (
  props: IEnvProps,
): Promise<{ totalCutHeight: number; lastBlockHeight: number }> => {
  const result = await fetch(props.graphql, {
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
      query: log(
        `query graphBlockHeight {
        completedBlockHeights(heightCount: 1) {
          edges {
            node {
              height
            }
          }
        }
      }`,
        `Querying Graph ${props.env}:`,
      ),
      variables: {},
      extensions: {},
    }),
  });

  const completedBlockHeightsResult =
    (await result.json()) as ICompletedBlockHeightsResponse;

  return log(
    {
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
    },
    `Graph response ${props.env}:`,
  );
};

export const runJobPerEnvironment = async (props: IEnvProps) => {
  try {
    const {
      totalCutHeight: totalHeightOnChainWeb,
      lastBlockHeight: lastBlockHeightChainweb,
    } = await countHeightOnChainweb(props);
    const {
      totalCutHeight: totalCutHeightGraph,
      lastBlockHeight: lastBlockHeightGraph,
    } = await countHeightOnGraph(props);

    if (Number.isNaN(totalHeightOnChainWeb)) {
      await sendErrorMessage(
        log(
          {
            title: `${props.env} chainweb.com fail`,
            msg: `We were unable to retrieve the blockheights from chainweb. \n There seems to be an issue with ChainWeb (${props.chainweb})`,
          },
          `Chainweb.com error ${props.env}:`,
        ),
      );
      return;
    }
    if (Number.isNaN(totalCutHeightGraph)) {
      await sendErrorMessage(
        log(
          {
            title: `${props.env} graph fail`,
            msg: `We were unable to retrieve the blockheights from the test graph. \n There seems to be an issue with test graph (${props.graphql})`,
          },
          `Graph error ${props.env}:`,
        ),
      );
      return;
    }

    if (
      Math.abs(totalHeightOnChainWeb - totalCutHeightGraph) >
      MAXBLOCKHEIGHT_DIFFERENCE
    ) {
      await sendErrorMessage(
        log(
          {
            title: `${props.env} chainweb and graph blockheight difference`,
            msg: `There is a large difference in the totalCutHeight between ${props.env} chainweb and graph.

Total cut height difference: ${Math.abs(totalHeightOnChainWeb - totalCutHeightGraph)}

[Chainweb lastBlockHeight](${props.chainweb}): ${lastBlockHeightChainweb}
[GraphiQL lastBlockHeight](${props.graphqlRef}): ${lastBlockHeightGraph}
Total height difference: ${lastBlockHeightChainweb - lastBlockHeightGraph}
`,
          },
          `Blockheight difference ${props.env}:`,
        ),
      );
    }
  } catch (e) {
    await sendErrorMessage(
      log(
        {
          title: `There was a general issue with the ${props.env} graph cron job`,
          msg: '```\nJSON.stringify(e)\n```',
        },
        `General error ${props.env}:`,
      ),
    );
  }
};

const testnet04Props = {
  env: 'testnet04',
  chainweb: 'https://ap1.testnet.chainweb.com/chainweb/0.0/testnet04/cut',
  graphql: 'https://graph.testnet.kadena.network/graphql',
  graphqlRef:
    'https://graph.testnet.kadena.network/graphql?query=query+graphBlockHeight+%7B%0A++++++++completedBlockHeights%28heightCount%3A+1%29+%7B%0A++++++++++edges+%7B%0A++++++++++++node+%7B%0A++++++++++++++height%0A++++++++++++%7D%0A++++++++++%7D%0A++++++++%7D%0A++++++%7D',
} as const;

const mainnet01Props = {
  env: 'mainnet01',
  chainweb: 'https://api.chainweb.com/chainweb/0.0/mainnet01/cut',
  graphql: 'https://graph.kadena.network/graphql',
  graphqlRef:
    'https://graph.kadena.network/graphql?query=query+graphBlockHeight+%7B%0A++++++++completedBlockHeights%28heightCount%3A+1%29+%7B%0A++++++++++edges+%7B%0A++++++++++++node+%7B%0A++++++++++++++height%0A++++++++++++%7D%0A++++++++++%7D%0A++++++++%7D%0A++++++%7D',
} as const;

const networksToTest = [testnet04Props, mainnet01Props];

export const runJob = async () => {
  await Promise.all(networksToTest.map(runJobPerEnvironment));
};

// To test locally run `bun ./index.tx` or equivalent
// runJob()
//   .then(() => console.log('done'))
//   .catch(console.error);
