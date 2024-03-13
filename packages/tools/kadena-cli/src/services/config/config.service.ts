import yaml from 'js-yaml';
import path from 'node:path';
import sanitize from 'sanitize-filename';
import { KEY_EXT, PLAIN_KEY_DIR } from '../../constants/config.js';
import {
  formatZodError,
  notEmpty,
  safeYamlParse,
} from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
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
  getPlainKeyByAlias(alias: string): Promise<IPlainKey | null>;
  getPlainKeys(): Promise<IPlainKey[]>;
  setPlainKey(key: IPlainKeyCreate): Promise<string>;
  deletePlainKey(key: IPlainKey): Promise<void>;
  deletePlainKeyAll(): Promise<void>;
}

export class ConfigService implements IConfigService {
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/parameter-properties
  public constructor(private services: Services) {}

  public async getPlainKey(
    filepath: string,
  ): ReturnType<IConfigService['getPlainKey']> {
    const file = await this.services.filesystem.readFile(filepath);
    if (file === null) return null;
    const parsed = plainKeySchema.safeParse(safeYamlParse(file));
    if (!parsed.success) {
      log.debug(formatZodError(parsed.error));
      return null;
    }
    const alias = path.basename(filepath);
    return {
      alias: alias,
      filepath,
      legacy: parsed.data.legacy ?? false,
      publicKey: parsed.data.publicKey,
      secretKey: parsed.data.secretKey,
    };
  }

  public async getPlainKeyByAlias(
    alias: string,
  ): ReturnType<IConfigService['getPlainKeyByAlias']> {
    const filename = alias.endsWith(KEY_EXT) ? alias : `${alias}${KEY_EXT}`;
    return this.getPlainKey(path.join(PLAIN_KEY_DIR, filename));
  }

  public async getPlainKeys(): ReturnType<IConfigService['getPlainKeys']> {
    const files = await this.services.filesystem.readDir(PLAIN_KEY_DIR);
    const keys = await Promise.all(
      files.map((key) => this.getPlainKey(path.join(PLAIN_KEY_DIR, key))),
    );
    return keys.filter(notEmpty);
  }

  public async setPlainKey(
    key: IPlainKeyCreate,
  ): ReturnType<IConfigService['setPlainKey']> {
    const filename = sanitize(key.alias);
    const filepath = path.join(PLAIN_KEY_DIR, `${filename}.key`);
    await this.services.filesystem.ensureDirectoryExists(PLAIN_KEY_DIR);
    if (await this.services.filesystem.fileExists(filepath)) {
      throw new Error(`Plain Key "${relativeToCwd(filepath)}" already exists.`);
    }
    const data: IPlainKeyFile = {
      legacy: key.legacy,
      publicKey: key.publicKey,
      secretKey: key.secretKey,
    };
    await this.services.filesystem.writeFile(
      filepath,
      yaml.dump(data, { lineWidth: -1 }),
    );
    return filepath;
  }

  public async deletePlainKey(
    key: IPlainKey,
  ): ReturnType<IConfigService['deletePlainKey']> {
    await this.services.filesystem.deleteFile(key.filepath);
  }
  public async deletePlainKeyAll(): ReturnType<
    IConfigService['deletePlainKeyAll']
  > {
    await this.services.filesystem.deleteDirectory(PLAIN_KEY_DIR);
  }
}
