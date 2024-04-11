import yaml from 'js-yaml';
import path from 'node:path';
import sanitize from 'sanitize-filename';
import {
  CWD_KADENA_DIR,
  ENV_KADENA_DIR,
  HOME_KADENA_DIR,
  WALLET_DIR,
  YAML_EXT,
} from '../../constants/config.js';
import {
  detectArrayFileParseType,
  getFileParser,
  notEmpty,
  safeYamlParse,
} from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { relativeToCwd } from '../../utils/path.util.js';
import type { Services } from '../index.js';
import { KadenaError } from '../service-error.js';
import {
  WALLET_SCHEMA_VERSION,
  walletSchema,
} from '../wallet/wallet.schemas.js';
import type { IWallet, IWalletFile } from '../wallet/wallet.types.js';
import { plainKeySchema } from './config.schemas.js';
import type {
  IPlainKey,
  IPlainKeyCreate,
  IPlainKeyFile,
  IWalletCreate,
} from './config.types.js';

export interface IConfigService {
  getDirectory(): string | null;
  // Key
  getPlainKey(filepath: string): Promise<IPlainKey | null>;
  getPlainKeys(directory?: string): Promise<IPlainKey[]>;
  setPlainKey(key: IPlainKeyCreate): Promise<string>;
  // wallet
  getWallet: (filepath: string) => Promise<IWallet | null>;
  setWallet: (wallet: IWalletCreate, update?: boolean) => Promise<string>;
  getWallets: () => Promise<IWallet[]>;
  deleteWallet: (filepath: string) => Promise<void>;
}

export class ConfigService implements IConfigService {
  public directory: string | null = null;
  public constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/parameter-properties
    private services: Services,
    directory?: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.setDirectory(directory);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private async setDirectory(directory?: string): Promise<void> {
    // Priority 1: directory passed in constructor
    if (directory !== undefined) {
      this.directory = directory;
      return;
    }
    // Priority 2: ENV KADENA_DIR
    if (
      ENV_KADENA_DIR !== undefined &&
      (await this.services.filesystem.directoryExists(ENV_KADENA_DIR))
    ) {
      this.directory = ENV_KADENA_DIR!;
      return;
    } else if (ENV_KADENA_DIR !== undefined) {
      log.warning(
        `Warning: 'KADENA_DIR' environment variable is set to a non-existent directory: ${ENV_KADENA_DIR}`,
      );
      log.warning();
    }
    // Priority 3: CWD .kadena dir
    if (await this.services.filesystem.directoryExists(CWD_KADENA_DIR)) {
      this.directory = CWD_KADENA_DIR;
      return;
    }
    // Priority 4: HOME .kadena dir
    if (await this.services.filesystem.directoryExists(HOME_KADENA_DIR)) {
      this.directory = HOME_KADENA_DIR;
      return;
    }
    // No directory found, instruct the user to run `kadena config init`
    this.directory = null;
  }

  public getDirectory(): string | null {
    return this.directory;
  }

  public async getPlainKey(
    filepath: string,
    /* How to parse file, defaults to yaml */
    type?: 'yaml' | 'json',
  ): ReturnType<IConfigService['getPlainKey']> {
    const file = await this.services.filesystem.readFile(filepath);
    if (file === null || type === undefined) return null;

    const parser = getFileParser(type);
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

  public async getWallet(
    filepath: string,
  ): ReturnType<IConfigService['getWallet']> {
    const file = await this.services.filesystem.readFile(filepath);
    if (file === null) {
      throw new Error(`Wallet file "${relativeToCwd(filepath)}" not found.`);
    }
    const parsed = walletSchema.safeParse(safeYamlParse(file));
    if (!parsed.success) return null;
    return {
      alias: parsed.data.alias,
      filepath,
      version: parsed.data.version,
      legacy: parsed.data.legacy ?? false,
      seed: parsed.data.seed,
      keys: parsed.data.keys,
    };
  }

  public async setWallet(
    wallet: IWalletCreate,
    update?: boolean,
  ): ReturnType<IConfigService['setWallet']> {
    const directory = await this.getDirectory();
    if (directory === null) throw new KadenaError('no_kadena_directory');
    const filename = sanitize(wallet.alias);
    const filepath = path.join(directory, WALLET_DIR, `${filename}${YAML_EXT}`);
    const exists = await this.services.filesystem.fileExists(filepath);
    if (exists && update !== true) {
      throw new Error(`Wallet "${relativeToCwd(filepath)}" already exists.`);
    }

    const data: IWalletFile = {
      alias: wallet.alias,
      seed: wallet.seed,
      version: WALLET_SCHEMA_VERSION,
      keys: wallet.keys,
    };
    if (wallet.legacy) data.legacy = wallet.legacy;
    await this.services.filesystem.ensureDirectoryExists(
      path.join(directory, WALLET_DIR),
    );
    await this.services.filesystem.writeFile(
      filepath,
      yaml.dump(data, { lineWidth: -1 }),
    );
    return filepath;
  }

  public async getWallets(): ReturnType<IConfigService['getWallets']> {
    const directory = await this.getDirectory();
    if (directory === null) throw new KadenaError('no_kadena_directory');
    const walletPath = path.join(directory, WALLET_DIR);
    if (!(await this.services.filesystem.directoryExists(walletPath))) {
      return [];
    }
    const files = await this.services.filesystem.readDir(walletPath);
    const filepaths = files.map((file) => path.join(walletPath, file));

    const wallets = await Promise.all(
      filepaths.map(async (filepath) =>
        this.getWallet(filepath).catch(() => null),
      ),
    );
    return wallets.filter(notEmpty);
  }

  public async deleteWallet(
    filepath: string,
  ): ReturnType<IConfigService['deleteWallet']> {
    await this.services.filesystem.deleteFile(filepath);
  }
}
