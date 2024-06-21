import { log } from '../../utils/logger.js';
import type { Services } from '../index.js';
import type { IAccount, IAccountCreate } from './account.types.js';

export interface IAccountService {
  get: (filepath: string) => Promise<IAccount | null>;
  getByAlias: (alias: string) => Promise<IAccount | null>;
  create: (account: IAccountCreate) => Promise<IAccount>;
  list: () => Promise<IAccount[]>;
  delete: (filepath: string) => Promise<void>;
}

export class AccountService implements IAccountService {
  // eslint-disable-next-line @typescript-eslint/parameter-properties, @typescript-eslint/naming-convention
  public constructor(private services: Services) {}

  public async get(filepath: string): ReturnType<IAccountService['get']> {
    return this.services.config.getAccount(filepath);
  }

  public async getByAlias(
    alias: string,
  ): ReturnType<IAccountService['getByAlias']> {
    const accounts = await this.services.config.getAccounts();
    const match = accounts.filter((account) => account.alias === alias);
    if (match.length === 1) {
      return match[0];
    } else if (match.length > 1) {
      log.warning(
        `Multiple accounts found with alias "${alias}", it is recommended to use unique aliases`,
      );
      return match[0];
    }
    return null;
  }

  public async create(
    account: IAccountCreate,
  ): ReturnType<IAccountService['create']> {
    const filepath = await this.services.config.setAccount(account, true);
    const result = await this.get(filepath);
    if (result === null) {
      throw new Error(`Account "${filepath}" not found`);
    }
    return result;
  }

  public async list(): ReturnType<IAccountService['list']> {
    return this.services.config.getAccounts();
  }

  public async delete(filepath: string): ReturnType<IAccountService['delete']> {
    return this.services.config.deleteAccount(filepath);
  }
}
