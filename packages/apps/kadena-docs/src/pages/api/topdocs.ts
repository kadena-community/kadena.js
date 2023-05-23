import { IResponse, ITopDoc } from '@/types/ApiResponse';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { NextApiRequest, NextApiResponse } from 'next';

const CLIENTEMAIL: string = process.env.NEXT_PUBLIC_GA_CLIENT_EMAIL ?? '';
const CLIENTKEY: string = process.env.NEXT_PUBLIC_GA_PRIVATE_KEY ?? '';

const analyticsDataClient: BetaAnalyticsDataClient =
  new BetaAnalyticsDataClient({
    credentials: {
      client_email: CLIENTEMAIL,
      private_key: CLIENTKEY,
    },
  });

const runReport = async (
  client: BetaAnalyticsDataClient,
): Promise<ITopDoc[]> => {
  const [response] = await client.runReport({
    property: `properties/377468115`,
    limit: 5,
    dateRanges: [
      {
        startDate: '2023-03-31',
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

const subscribe = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponse<ITopDoc[]>>,
): Promise<void> => {
  if (!CLIENTEMAIL || !CLIENTKEY) {
    res.status(500).json({
      status: 500,
      message: 'CLIENTEMAIL AND CLIENTKEY missing',
    });
    res.end();
  }

  const result = await runReport(analyticsDataClient);

  res.status(500).json({
    status: 200,
    message: 'ok',
    body: result,
  });
};

export default subscribe;
