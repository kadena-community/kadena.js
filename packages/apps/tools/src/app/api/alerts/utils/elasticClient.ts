import { Client } from '@elastic/elasticsearch';
import type { IAlert, INETWORK } from './constants';

const getElasticIndexByEnv = (env: INETWORK): string => {
  if (env.key === 'mainnet01') return 'chainweb-balances-mainnet01';
  //testnet
  return 'chainweb-balances-testnet04';
};

export const getClient = () => {
  const client = new Client({
    cloud: { id: `${process.env.ELASTIC_CLOUD_ID}` },
    auth: { apiKey: `${process.env.ELASTIC_CLOUD_APIKEY}` },
  });

  const index = async (data: Record<string, any>, network: INETWORK) => {
    return client.index({
      index: getElasticIndexByEnv(network),
      document: data,
    });
  };

  const getLastRecord = async (
    alert: IAlert,
    network: INETWORK,
  ): Promise<Record<string, any>[]> => {
    const ids = await client.search({
      index: getElasticIndexByEnv(network),
      size: 2,
      sort: { '@timestamp': 'desc' },
      query: {
        match: {
          code: alert.code,
        },
      },
    });

    return ids.hits.hits;
  };

  return {
    index,
    getLastRecord,
  };
};
