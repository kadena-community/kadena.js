import yaml from 'js-yaml';
import path from 'node:path';
import sanitize from 'sanitize-filename';
import { KEY_EXT, PLAIN_KEY_DIR } from '../../constants/config.js';
import {
  formatZodError,
  notEmpty,
  safeYamlParse,
} from '../../utils/helpers.js';
import { relativeToCwd } from '../../utils/path.util.js';
import type { Services } from '../index.js';
import { plainKeySchema } from './config.schemas.js';
import type {
  IPlainKey,
  IPlainKeyCreate,
  IPlainKeyFile,
} from './config.types.js';

export interface IConfigService {
  // Key
  getPlainKey(filepath: string): Promise<IPlainKey | null>;
  getPlainKeys(directory?: string): Promise<IPlainKey[]>;
  setPlainKey(key: IPlainKeyCreate): Promise<string>;
  // wallet
  getWallet: (filepath: string) => Promise<IWallet | null>;
  setWallet: (wallet: IWalletCreate) => Promise<string>;
  getWallets: () => Promise<IWallet[]>;
  deleteWallet: (filepath: string) => Promise<void>;
}

export class ConfigService implements IConfigService {
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/parameter-properties
  public constructor(private services: Services) {}

  public async getPlainKey(
    filepath: string,
    /* How to parse file, defaults to yaml */
    type?: 'yaml' | 'json',
  ): ReturnType<IConfigService['getPlainKey']> {
    const file = await this.services.filesystem.readFile(filepath);
    if (file === null) return null;

    const parser = type === 'json' ? safeJsonParse : safeYamlParse;
    const parsed = plainKeySchema.safeParse(parser(file));
    if (!parsed.success) return null;

    const alias = path.basename(filepath);
    return {
      alias: alias,
      filepath,
      legacy: parsed.data.legacy ?? false,
      publicKey: parsed.data.publicKey,
      secretKey: parsed.data.secretKey,
    };
  }

  public async getPlainKeys(
    directory?: string,
  ): ReturnType<IConfigService['getPlainKeys']> {
    const dir = directory ?? process.cwd();
    const files = await this.services.filesystem.readDir(dir);
    const filepaths = files.map((file) => path.join(dir, file));
    const parsableFiles = detectArrayFileParseType(filepaths);
    const keys = await Promise.all(
      parsableFiles.map(async (file) =>
        this.getPlainKey(file.filepath, file.type),
      ),
    );
    return keys.filter(notEmpty);
  }

  public async setPlainKey(
    key: IPlainKeyCreate,
  ): ReturnType<IConfigService['setPlainKey']> {
    const filename = sanitize(key.alias);
    const filepath = path.join(process.cwd(), `${filename}${YAML_EXT}`);
    if (await this.services.filesystem.fileExists(filepath)) {
      throw new Error(`Plain Key "${relativeToCwd(filepath)}" already exists.`);
    }
    const data: IPlainKeyFile = {
      publicKey: key.publicKey,
      secretKey: key.secretKey,
    };
    if (key.legacy) data.legacy = key.legacy;
    await this.services.filesystem.writeFile(
      filepath,
      yaml.dump(data, { lineWidth: -1 }),
    );
    return filepath;
  }

  }
  }
}
