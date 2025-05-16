import { Client } from '@elastic/elasticsearch';
import type { IAlert } from './constants';

const ELASTICINDEX = 'balance-reporter';

export const getClient = () => {
  const client = new Client({
    cloud: { id: `${process.env.ELASTIC_CLOUD_ID}` },
    auth: { apiKey: `${process.env.ELASTIC_CLOUD_APIKEY}` },
  });

  const index = async (data: Record<string, any>) => {
    return client.index({
      index: ELASTICINDEX,
      document: data,
    });
  };

  const getLastRecord = async (
    alert: IAlert,
  ): Promise<Record<string, any>[]> => {
    const ids = await client.search({
      index: ELASTICINDEX,
      size: 2,
      sort: { timestamp: 'desc' },
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
