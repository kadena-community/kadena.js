import { MAXBLOCKHEIGHT_DIFFERENCE } from '../constants';
import { sendErrorMessage } from './messages';

interface IEnvProps {
  env: 'testnet04' | 'mainnet01';
  chainweb: string;
  graphql: string;
}

const countHeightOnChainweb = async (props: IEnvProps): Promise<number> => {
  try {
    const result = await fetch(props.chainweb);
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

const countHeightOnGraph = async (props: IEnvProps): Promise<number> => {
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

export const runJobPerEnvironment = async (props: IEnvProps) => {
  try {
    const totalHeightOnChainWeb = await countHeightOnChainweb(props);
    const totalHeightOnGraph = await countHeightOnGraph(props);

    if (Number.isNaN(totalHeightOnChainWeb)) {
      await sendErrorMessage({
        title: `${props.env} chainweb.com fail`,
        msg: `We were unable to retrieve the blockheights from chainweb. \n There seems to be an issue with ChainWeb (${props.chainweb})`,
      });
      return;
    }
    if (Number.isNaN(totalHeightOnGraph)) {
      await sendErrorMessage({
        title: `${props.env} graph fail`,
        msg: `We were unable to retrieve the blockheights from the test graph. \n There seems to be an issue with test graph (${props.graphql})`,
      });
      return;
    }

    if (
      Math.abs(totalHeightOnChainWeb - totalHeightOnGraph) >
      MAXBLOCKHEIGHT_DIFFERENCE
    ) {
      await sendErrorMessage({
        title: `${props.env} graph issue`,
        msg: `There is a large difference in the last blockheight between ${props.env} chainweb and graph. \n difference: ${Math.abs(totalHeightOnChainWeb - totalHeightOnGraph)}`,
      });
    }
  } catch (e) {
    await sendErrorMessage({
      title: `There was a general issue with the ${props.env} graph cron job`,
      msg: ``,
    });
  }
};

export const runJob = async () => {
  await runJobPerEnvironment({
    env: 'testnet04',
    chainweb: 'https://ap1.testnet.chainweb.com/chainweb/0.0/testnet04/cut',
    graphql: 'https://graph.testnet.kadena.network/graphql',
  });

  await runJobPerEnvironment({
    env: 'mainnet01',
    chainweb: 'https://api.chainweb.com/chainweb/0.0/mainnet01/cut ',
    graphql: 'https://graph.kadena.network/graphql',
  });
};
