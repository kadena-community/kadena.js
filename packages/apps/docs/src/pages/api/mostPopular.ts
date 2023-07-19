import analyticsDataClient from '@/utils/analyticsDataClient';
import storeAnalyticsData from '@/utils/storeAnalyticsData';
import { NextApiRequest, NextApiResponse } from 'next';

const lastMonths = 3;

// Get today's date
const today = new Date();
// Get lastMonths months ago
const startDate = new Date(today.setMonth(today.getMonth() - lastMonths));
// Get the year
const year = startDate.getFullYear();
// Get the month
const month = startDate.getMonth() + 1;
// Get the day
const day = startDate.getDate();

// Put it in Google's date format
const dayFormat = `${year}-${month - lastMonths}-${day}`;

const mostPopular = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
    dateRanges: [
      {
        // Run from today to 31 days ago
        startDate: dayFormat,
        endDate: 'today',
      },
    ],
    dimensions: [
      {
        // Get the page path
        name: 'pagePathPlusQueryString',
      },
    ],
    metrics: [
      {
        // And tell me how many active users there were for each of those
        name: 'activeUsers',
      },
    ],
  });

  await storeAnalyticsData(response);
  res.status(200).json(response);
};

export default mostPopular;
