import type {
  IMostPopularPage,
  IRow,
  IRunReportResponse,
} from '@/MostPopularData';
import type { IMenuData } from '@kadena/docs-tools';
import { getMenuData } from '@kadena/docs-tools';
import fs from 'fs';
import path from 'path';
import analyticsDataClient from './analyticsDataClient';
import storeAnalyticsData from './storeAnalyticsData';

// to be backwards compatible we need to remove the starting '/docs' from the slug
const cleanSlug = (slug?: string): string => {
  if (!slug) return '';
  const pattern = /^\/docs/; // This regular expression matches '/docs' at the beginning of the string
  return slug.replace(pattern, '');
};

const findPost = (url: string, data: IMenuData[]): IMenuData | undefined => {
  const posts = data.flatMap((item) =>
    item.children.flatMap((item) => item.children),
  );

  return posts.find((item) => {
    if (item.root === url) return true;
  });
};

// sometimes the title is not set. lets find them
// this will also check, if the link still exists
const setTitle = async (
  item: IMostPopularPage,
): Promise<IMostPopularPage | undefined> => {
  const menuData: IMenuData[] = await getMenuData();
  const post = findPost(cleanSlug(item.path), menuData);

  if (!post) return;

  return { ...item, title: post?.title };
};

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

async function pushToTopPages(
  topPages: IMostPopularPage[],
  row: IRow,
): Promise<IMostPopularPage[]> {
  if (row === undefined || !row.dimensionValues || !row.metricValues)
    return topPages;

  const isPageAlreadyExist: IMostPopularPage | undefined = topPages.find(
    (page) => page.path === row.dimensionValues?.[0]?.value,
  );

  if (isPageAlreadyExist) {
    isPageAlreadyExist.views += parseFloat(row.metricValues?.[0]?.value ?? '0');
  } else {
    const views = parseFloat(row.metricValues?.[0]?.value ?? '0');

    const item = {
      path: cleanSlug(row.dimensionValues[0]?.value) ?? '',
      views,
      title: row.dimensionValues[1]?.value ?? '',
    };

    const newItem = await setTitle(item);

    if (newItem) {
      topPages.push(newItem);
    }
  }

  return topPages;
}

async function getTopPages(
  data: IRunReportResponse,
  slug: string,
  limit: number,
): Promise<IMostPopularPage[]> {
  const cleanedSlug = cleanSlug(slug);

  const topPages = await (data?.rows || []).reduce(
    async (promiseResult: Promise<IMostPopularPage[]>, row: IRow) => {
      const result = await promiseResult;
      if (row.dimensionValues?.[0]) {
        const value = cleanSlug(row.dimensionValues[0]?.value) ?? cleanedSlug;

        // Not including the current page
        if (value === cleanedSlug) return result;

        // Not including search pages
        if (value.startsWith('/search')) return result;

        // Not including old blogchain
        if (value.startsWith('/blogchain')) return result;

        // Not including `__tests` pages
        if (value.includes('/__tests')) return result;

        if (!value.startsWith(cleanedSlug)) return result;
      }

      return pushToTopPages(result, row);
    },
    Promise.resolve([]),
  );

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
    const mostPopularPages = await getTopPages(JSON.parse(data), slug, limit);

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

    const mostPopularPages = await getTopPages(response, slug, limit);

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
