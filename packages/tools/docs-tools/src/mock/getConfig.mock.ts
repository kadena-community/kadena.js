import { readFile } from 'fs/promises';
import yaml from 'js-yaml';
import { join } from 'path';
import type { IConfig } from 'src/types';

const getConfig = async (): Promise<IConfig> => {
  const configFilePath = join(process.cwd(), 'src/mock/config.mock.yaml');
  try {
    const configData = await readFile(configFilePath, 'utf-8');
    return yaml.load(configData) as IConfig;
  } catch (e) {
    console.error(e);
    throw new Error('Could not load config yaml');
  }
};

export { getConfig };
