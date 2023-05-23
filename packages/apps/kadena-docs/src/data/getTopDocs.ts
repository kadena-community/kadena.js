import { formatISODate, getOneMonthAgo } from '@/utils/dates';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const CLIENTEMAIL: string = process.env.NEXT_PUBLIC_GA_CLIENT_EMAIL ?? '';
const CLIENTKEY: string = process.env.NEXT_PUBLIC_GA_PRIVATE_KEY ?? '';

export interface ITopDoc {
  label: string;
  url: string;
}

let client: BetaAnalyticsDataClient;
const getClient = (): BetaAnalyticsDataClient | undefined => {
  if (!CLIENTEMAIL || !CLIENTKEY) return;

  if (client === undefined) return client;

  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: CLIENTEMAIL,
      private_key: CLIENTKEY,
    },
  });
};

export const getTopDocs = async (): Promise<ITopDoc[]> => {
  const analyticsDataClient = await getClient();
  if (!analyticsDataClient) return [];

  const [response] = await analyticsDataClient.runReport({
    property: `properties/377468115`,
    limit: 5,
    dateRanges: [
      {
        startDate: formatISODate(getOneMonthAgo(new Date())),
        endDate: 'today',
      },
    ],
    dimensions: [
      {
        // And also get the page title
        name: 'pageTitle',
      },
      {
        // And also get the page title
        name: 'pagePath',
      },
    ],
    metrics: [
      {
        name: 'activeUsers',
      },
    ],
  });

  const topDocs =
    response.rows?.map((item): ITopDoc => {
      const label = item.dimensionValues
        ? `${item.dimensionValues[0].value}`
        : '';
      const url = item.dimensionValues
        ? `${item.dimensionValues[1].value}`
        : '';
      return {
        label,
        url,
      };
    }) ?? [];

  return topDocs;
};
