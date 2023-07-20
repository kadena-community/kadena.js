import analyticsDataClient from '@/utils/analyticsDataClient';
import storeAnalyticsData from '@/utils/storeAnalyticsData';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

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

function getModifiedTimeInSeconds(file: string): number | undefined {
  if (!fs.existsSync(file)) return;

  const stats = fs.statSync(file, { bigint: false });
  if (!stats.isFile() || stats.mtime === undefined) return;

  const seconds =
    (new Date().getTime() - new Date(stats.mtime).getTime()) / 1000;
  return seconds;
}

function validateCache(): boolean {
  const dayInSecs = 86400;
  const dataFilePath = path.join(process.cwd(), 'src/data/mostPopular.json');

  const fileLastModifiedTime: number | undefined =
    getModifiedTimeInSeconds(dataFilePath) ?? 0;

  if (!fileLastModifiedTime) return true;

  if (fileLastModifiedTime > dayInSecs) return true;

  return false;
}

const mostPopular = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (!validateCache()) {
    const dataFilePath = path.join(process.cwd(), 'src/data/mostPopular.json');
    const data = fs.readFileSync(dataFilePath, 'utf8');
    res.status(200).json(JSON.parse(data));
    return;
  }

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
    dateRanges: [
      {
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
