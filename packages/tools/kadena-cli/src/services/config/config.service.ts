import yaml from 'js-yaml';
import { vol } from 'memfs';
import { statSync } from 'node:fs';
import path from 'node:path';
import sanitize from 'sanitize-filename';
import {
  ACCOUNT_DIR,
  ENV_KADENA_DIR,
  HOME_KADENA_DIR,
  IS_TEST,
  WALLET_DIR,
  WORKING_DIRECTORY,
  YAML_EXT,
} from '../../constants/config.js';
import {
  detectArrayFileParseType,
  formatZodError,
  getFileParser,
  notEmpty,
  safeYamlParse,
} from '../../utils/globalHelpers.js';
import { arrayNotEmpty } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { relativeToCwd } from '../../utils/path.util.js';
import { accountSchema } from '../account/account.schemas.js';
import type {
  IAccount,
  IAccountCreate,
  IAccountFile,
} from '../account/account.types.js';
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

// To avoid promises / asynchrounous operations in the constructor
// instead of using a filesystem service, created "directoryExists" helper
const directoryExists = (path?: string): boolean => {
  if (path === undefined) return false;
  try {
    const stat = IS_TEST ? vol.statSync.bind(vol) : statSync;
    return stat(path).isDirectory();
  } catch (e) {
    return false;
  }
};

// recursively look for `.kadena` directory in parent folders
const findKadenaDirectory = (searchDir: string): string | null => {
  const dir = path.join(searchDir, '.kadena');
  if (directoryExists(dir)) return dir;
  const parent = path.join(searchDir, '..');
  if (parent !== searchDir) return findKadenaDirectory(parent);
  return null;
};

export interface IConfigService {
  getDirectory(): string;
  setDirectory(directory: string): void;
  // Key
  getPlainKey(filepath: string): Promise<IPlainKey | null>;
  getPlainKeys(directory?: string): Promise<IPlainKey[]>;
  setPlainKey(key: IPlainKeyCreate): Promise<string>;
  // wallet
  getWallet: (filepath: string) => Promise<IWallet | null>;
  setWallet: (wallet: IWalletCreate, update?: boolean) => Promise<string>;
  getWallets: () => Promise<IWallet[]>;
  deleteWallet: (filepath: string) => Promise<void>;
  // account
  setAccount: (account: IAccountCreate, update?: boolean) => Promise<string>;
  getAccount: (filepath: string) => Promise<IAccount | null>;
  getAccounts: () => Promise<IAccount[]>;
  deleteAccount: (filepath: string) => Promise<void>;
}

export class ConfigService implements IConfigService {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private directory: string | null = null;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private services: Services;

  public constructor(services: Services, directory?: string) {
    this.services = services;
    this._discoverDirectory(directory);
  }

  public setDirectory(directory: string): void {
    if (!directoryExists(directory)) {
      log.warning(
        `Config service initialized with directory that does not exist: ${directory}`,
      );
    }
    this.directory = directory;
  }

  private _discoverDirectory(directory?: string): void {
    // Priority 1: directory passed in constructor
    if (directory !== undefined) {
      this.directory = directory;
      return;
    }

    // Priority 2: ENV KADENA_DIR
    if (ENV_KADENA_DIR !== undefined) {
      if (directoryExists(ENV_KADENA_DIR)) {
        this.directory = ENV_KADENA_DIR;
        return;
      } else {
        log.warning(
          `Warning: 'KADENA_DIR' environment variable is set to a non-existent directory: ${ENV_KADENA_DIR}\n`,
        );
      }
    }

    // Priority 3: CWD .kadena dir in recursive parent search
    const kadenaDirectory = findKadenaDirectory(WORKING_DIRECTORY);
    if (kadenaDirectory !== null) {
      this.directory = kadenaDirectory;
      return;
    }

    // Priority 4: HOME .kadena dir
    if (directoryExists(HOME_KADENA_DIR)) {
      this.directory = HOME_KADENA_DIR;
      return;
    }

    // No directory found, instruct the user to run `kadena config init`
    this.directory = null;
  }

  public getDirectory(): string {
    if (this.directory === null) throw new KadenaError('no_kadena_directory');
    // console.log({ directory: this.directory });
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
    const directory = this.getDirectory();
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
    const directory = this.getDirectory();
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

  // Account
  public async setAccount(
    account: IAccountCreate,
    update?: boolean,
  ): ReturnType<IConfigService['setAccount']> {
    const directory = this.getDirectory();
    const filename = sanitize(account.alias);
    const filepath = path.join(
      directory,
      ACCOUNT_DIR,
      `${filename}${YAML_EXT}`,
    );
    const exists = await this.services.filesystem.fileExists(filepath);
    if (exists && update !== true) {
      throw new Error(`Account "${relativeToCwd(filepath)}" already exists.`);
    }
    if (!arrayNotEmpty(account.publicKeys)) {
      throw new Error('No public keys provided');
    }

    const data: IAccountFile = {
      alias: account.alias,
      name: account.name,
      fungible: account.fungible,
      predicate: account.predicate,
      publicKeys: account.publicKeys,
    };

    await this.services.filesystem.ensureDirectoryExists(
      path.join(directory, ACCOUNT_DIR),
    );
    await this.services.filesystem.writeFile(
      filepath,
      yaml.dump(data, { lineWidth: -1 }),
    );
    return filepath;
  }

  public async getAccount(
    filepath: string,
  ): ReturnType<IConfigService['getAccount']> {
    const file = await this.services.filesystem.readFile(filepath);
    if (file === null) {
      throw new Error(`Account file "${relativeToCwd(filepath)}" not found.`);
    }
    const parsedYaml = safeYamlParse<IAccountFile>(file);
    // Alias was added later, insert here for backwards compatibility
    if (parsedYaml && parsedYaml.alias === undefined) {
      parsedYaml.alias = path.basename(filepath, YAML_EXT);
    }

    const parsed = accountSchema.safeParse(parsedYaml);
    if (!parsed.success) {
      throw new Error(
        `Error parsing account file: ${formatZodError(parsed.error)}`,
      );
    }
    return {
      alias: parsed.data.alias,
      name: parsed.data.name,
      fungible: parsed.data.fungible,
      predicate: parsed.data.predicate,
      publicKeys: parsed.data.publicKeys,
      filepath,
    };
  }

  public async getAccounts(): ReturnType<IConfigService['getAccounts']> {
    const directory = this.getDirectory();
    const accountDir = path.join(directory, ACCOUNT_DIR);
    if (!(await this.services.filesystem.directoryExists(accountDir))) {
      return [];
    }
    const files = await this.services.filesystem.readDir(accountDir);
    const filepaths = files.map((file) => path.join(accountDir, file));

    const accounts = await Promise.all(
      filepaths.map(async (filepath) =>
        this.getAccount(filepath).catch(() => null),
      ),
    );

    return accounts.filter(notEmpty);
  }

  public async deleteAccount(
    filepath: string,
  ): ReturnType<IConfigService['deleteAccount']> {
    await this.services.filesystem.deleteFile(filepath);
  }
}
