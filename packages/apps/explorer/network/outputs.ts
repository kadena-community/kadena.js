import axios from 'axios';
import {
  DefaultQueryParams,
  jsonHeader,
  queryParamsTypeAdapter,
  switchBetweenConfig,
} from '../utils/api';
import {
  MAIN_NETWORK_API_URL,
  TEST_NETWORK_API_URL,
} from '../config/Constants';
import { APIRemoteRoute } from '../config/Routes';
import { decodeBase64ToJSON } from '../utils/string';

interface BlockQueryParams extends DefaultQueryParams {
  payload: string;
  instance: string;
  version: string;
  chainId: string;
}

export interface OutputResponseData {
  coinbaseData: {
    gas: number;
    result: string;
    status: string;
    requestKey: string;
    events: any[];
    logs: string;
    metadata: string;
    transactionId: number;
  };
  minerData: {
    account: string;
    publicKeys: string[];
    predicate: string;
  };
  outputsHash: string;
  payloadHash: string;
  transactionsHash: string;
  transactions: any[][];
}

const apiTransactionsAdapter = (transactionsData: any[][]) => {
  return (transactionsData || []).map(transactionIterations => {
    return (transactionIterations || []).map(item => decodeBase64ToJSON(item));
  }) as OutputResponseData['transactions'];
};

const apiCoinbaseAdapter = (coinbaseData: any) => {
  const coinbaseJSON = decodeBase64ToJSON(coinbaseData);
  return {
    gas: coinbaseJSON.gas,
    result: coinbaseJSON.result.data,
    status: coinbaseJSON.result.status,
    requestKey: coinbaseJSON.reqKey,
    events: coinbaseJSON.events,
    logs: coinbaseJSON.logs,
    transactionId: coinbaseJSON.txId,
  } as OutputResponseData['coinbaseData'];
};

const apiMinerDataAdapter = (minerData: any) => {
  const minerDataJSON = decodeBase64ToJSON(minerData);
  return {
    account: minerDataJSON.account,
    publicKeys: minerDataJSON['public-keys'],
    predicate: minerDataJSON.predicate,
  } as OutputResponseData['minerData'];
};

const apiOutputResponseDataAdapter = (apiResponseData: any) => {
  const minerData = apiMinerDataAdapter(apiResponseData.minerData);
  const coinbaseData = apiCoinbaseAdapter(apiResponseData.coinbase);
  const transactions = apiTransactionsAdapter(apiResponseData.transactions);
  return {
    minerData,
    coinbaseData,
    transactions,
    outputsHash: apiResponseData.outputsHash,
    payloadHash: apiResponseData.payloadHash,
    transactionsHash: apiResponseData.transactionsHash,
  } as OutputResponseData;
};

export async function getBlockOutputs(
  query: BlockQueryParams,
): Promise<OutputResponseData | null> {
  const { network, payload, instance, version, chainId } =
    queryParamsTypeAdapter<BlockQueryParams>(query);
  if (
    !network ||
    !payload ||
    chainId === undefined ||
    chainId === '' ||
    !instance ||
    !version
  ) {
    return null;
  }
  return switchBetweenConfig(
    network,
    async () => {
      const testNetConfigResponse = await axios.get(
        `${TEST_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.Payload}/${payload}${APIRemoteRoute.Outputs}`,
        {
          headers: jsonHeader,
        },
      );
      return apiOutputResponseDataAdapter(testNetConfigResponse.data);
    },
    async () => {
      const mainNetConfigResponse = await axios.get(
        `${MAIN_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.Payload}/${payload}${APIRemoteRoute.Outputs}`,
        {
          headers: jsonHeader,
        },
      );
      return apiOutputResponseDataAdapter(mainNetConfigResponse.data);
    },
    () => {
      return null;
    },
  );
}
