import { IS_TEST } from '../constants/config.js';

import { memoryFileSystemService } from './fs/fs.memory.service.js';
import type { IFileSystemService } from './fs/fs.service.js';
import { fileSystemService } from './fs/fs.service.js';

import type { IConfigService } from './config/config.service.js';
import { ConfigService } from './config/config.service.js';
export * from './config/config.types.js';

import type { IPactJSService } from './pactjs/pactjs.service.js';
import { PactJSService } from './pactjs/pactjs.service.js';
import type { IPlainKeyService } from './plain-key/plainkey.service.js';
import { PlainKeyService } from './plain-key/plainkey.service.js';
import type { IWalletService } from './wallet/wallet.service.js';
import { WalletService } from './wallet/wallet.service.js';

interface IServiceOptions {
  configDirectory?: string;
}

export class Services {
  public filesystem: IFileSystemService;
  public config: IConfigService;
  public plainKey: IPlainKeyService;
  public wallet: IWalletService;
  public pactjs: IPactJSService;
  public location?: string;

  public constructor(options?: IServiceOptions) {
    this.filesystem = IS_TEST ? memoryFileSystemService : fileSystemService;
    this.config = new ConfigService(this, options?.configDirectory);
    this.plainKey = new PlainKeyService(this);
    this.wallet = new WalletService(this);
    this.pactjs = new PactJSService(this);
  }
}

export const services = new Services();
