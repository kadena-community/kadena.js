import fsPromises from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/mostPopular.json');

export default async function storeAnalyticsData(data: unknown): Promise<void> {
  await fsPromises.writeFile(dataFilePath, JSON.stringify(data));
}
