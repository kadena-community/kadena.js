import fsPromises from 'fs/promises';

export default async function storeAnalyticsData(
  filePath: string,
  data: string,
): Promise<void> {
  await fsPromises.writeFile(filePath, data, 'utf8');
}
