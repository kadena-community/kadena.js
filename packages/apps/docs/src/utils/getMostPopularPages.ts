import analyticsDataClient from './analyticsDataClient';
import storeAnalyticsData from './storeAnalyticsData';

import {
  IMostPopularPage,
  IRow,
  IRunReportResponse,
} from '@/types/MostPopularData';
import fs from 'fs';
import path from 'path';

function getStartDateOfLastMonths(lastMonths = 3): string {
  // Get today's date
  const today = new Date();
  // Get `${lastMonths}` months ago from today
  const startDate = new Date(today.setMonth(today.getMonth() - lastMonths));
  // Get the year
  const year = startDate.getFullYear();
  // Get the month (add 1 because JS counts months from 0 to 11)
  const month = startDate.getMonth() + 1;
  // Get the day
  const day = startDate.getDate();

  // Put it in Google's date format
  return `${year}-${month}-${day}`;
}

function getModifiedTimeInSeconds(file: string): number | undefined {
  if (!fs.existsSync(file)) return;

  const stats = fs.statSync(file, { bigint: false });
  if (!stats.isFile() || stats.mtime === undefined) return;

  const seconds =
    (new Date().getTime() - new Date(stats.mtime).getTime()) / 1000;
  return seconds;
}

// Check if the cache is older than a day
function validateCache(filePath: string): boolean {
  const dayInSecs = 86400; // 24 * 60 * 60

  const fileLastModifiedTime: number | undefined =
    getModifiedTimeInSeconds(filePath) ?? 0;

  if (!fileLastModifiedTime) return true;

  if (fileLastModifiedTime > dayInSecs) return true;

  return false;
}

function pushToTopPages(
  topPages: IMostPopularPage[],
  row: IRow,
): IMostPopularPage[] {
  if (row === undefined || !row.dimensionValues || !row.metricValues)
    return topPages;

  const isPageAlreadyExist: IMostPopularPage | undefined = topPages.find(
    (page) => page.path === row.dimensionValues?.[0]?.value,
  );

  if (isPageAlreadyExist) {
    isPageAlreadyExist.views =
      parseFloat(isPageAlreadyExist.views.toString()) +
      parseFloat(row.metricValues?.[0]?.value ?? '0');
  } else {
    const views = row.metricValues?.[0].value ?? '0';
    topPages.push({
      path: row.dimensionValues[0].value ?? '',
      views: parseFloat(views),
      title: row.dimensionValues[1].value ?? '',
    });
  }

  return topPages;
}

function getTopPages(
  data: IRunReportResponse,
  slug: string,
  limit: number,
): IMostPopularPage[] {
  let topPages: IMostPopularPage[] = [];
  (data?.rows || []).forEach((row: IRow) => {
    if (row.dimensionValues?.[0]) {
      const value = row.dimensionValues[0].value ?? slug;

      // Not including the current page
      if (value === slug) return;

      // Not including search pages
      if (value.startsWith('/search')) return;

      // Not including `__tests` pages
      if (value.includes('/__tests')) return;

      if (!value.startsWith(slug)) return;
    }
    topPages = pushToTopPages(topPages, row);
  });

  return topPages.sort((a, b) => b.views - a.views).slice(0, limit);
}

export default async function getMostPopularPages(
  slug = '/',
  limit = 5,
): Promise<IMostPopularPage[]> {
  const dataFilePath = path.join(
    process.cwd(),
    'src/_generated/mostPopular.json',
  );

  const GOOGLE_ANALYTICS_PROPERTY_ID = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
  const GOOGLE_APPLICATION_CREDENTIALS =
    process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (
    GOOGLE_ANALYTICS_PROPERTY_ID === undefined ||
    GOOGLE_APPLICATION_CREDENTIALS === undefined
  )
    return [];

  if (!validateCache(dataFilePath)) {
    const data: string = fs.readFileSync(dataFilePath, 'utf8');
    const mostPopularPages = getTopPages(JSON.parse(data), slug, limit);
    return mostPopularPages;
  }

  // If the cache is older than a day, use the API
  try {
    const [response] = (await analyticsDataClient.runReport({
      property: `properties/${GOOGLE_ANALYTICS_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: getStartDateOfLastMonths(3),
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          // Get the page path
          name: 'pagePathPlusQueryString',
        },
        {
          // Get the page title
          name: 'pageTitle',
        },
      ],
      metrics: [
        {
          // And tell me how many active users there were for each of those
          name: 'activeUsers',
        },
      ],
    })) as unknown as [IRunReportResponse];

    const mostPopularPages = getTopPages(response, slug, limit);

    // Store complete data in a file to avoid hitting the API limit
    await storeAnalyticsData(dataFilePath, JSON.stringify(response));

    return mostPopularPages;
  } catch (error) {
    // Even if the API fails, we still want to show the page
    // so we return an empty array
    console.error(error);
    return [];
  }
}
