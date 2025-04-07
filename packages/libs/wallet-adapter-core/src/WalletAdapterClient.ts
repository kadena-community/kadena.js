import EventEmitter from 'eventemitter3';
import {
  AccountInfo,
  Adapter,
  AdapterFactory,
  ICommand,
  ISigningRequestPartial,
  IUnsignedCommand,
  NetworkInfo,
} from './types';

/**
 * @public
 * A client that manages multiple wallet adapters by calling "request" with standard "kadena_*" methods.
 */
export class WalletAdapterClient {
  private adapterFactories: AdapterFactory[] = [];
  private adapters: Adapter[] = [];
  private eventEmitter = new EventEmitter();

  constructor(adapters: (Adapter | AdapterFactory)[]) {
    for (const adapter of adapters) {
      if ('detect' in adapter && 'adapter' in adapter && 'name' in adapter) {
        this.adapterFactories.push(adapter);
      } else if ('name' in adapter) {
        this.adapterFactories.push({
          name: adapter.name,
          adapter: async () => adapter,
          detect: async () => null,
        });
        this.adapters.push(adapter);
      } else {
        console.warn('Invalid adapter', adapter);
      }
    }
  }

  isDetected(name: string): boolean {
    return !!this.getAdapter(name);
  }

  async init() {
    const promises = this.adapterFactories.map(async (adapterFactory) => {
      const exists = this.getAdapter(adapterFactory.name);
      if (exists) return exists;

      const provider = await adapterFactory.detect();
      if (provider) {
        const adapter = await adapterFactory.adapter(provider);

        if (!adapter || !adapter.name) {
          console.warn('Invalid adapter', adapter);
          return;
        }

        this.adapters.push(adapter);
        this.eventEmitter.emit('adapterDetected', adapter);
        return adapter;
      }
    });
    await Promise.allSettled(promises);
  }

  public getProviders(): { name: string; detected: boolean }[] {
    return this.adapterFactories.map((adapterFactory) => {
      const adapter = this.getAdapter(adapterFactory.name);
      return {
        name: adapterFactory.name,
        detected: !!adapter,
      };
    });
  }

  public getDetectedAdapters(): Adapter[] {
    return this.adapters;
  }

  public getAdapter(adapterName: string): Adapter | undefined {
    return this.adapters.find(
      (adapter) => adapter.name.toLowerCase() === adapterName.toLowerCase(),
    );
  }

  public onAdapterDetected(
    cb: (adapter: Adapter) => void,
    options?: { signal?: AbortSignal },
  ) {
    this.eventEmitter.on('adapterDetected', cb, options);
  }

  private getAdapterAsserted(adapterName: string): Adapter {
    const adapter = this.getAdapter(adapterName);
    if (!adapter) {
      throw new Error(`Adapter ${adapterName} not found`);
    }
    return adapter;
  }

  /**
   * A generic method to call adapter.request(...) for manual calling.
   */
  public async request(
    adapterName: string,
    args: { method: string; [key: string]: any },
  ): Promise<unknown> {
    const adapter = this.getAdapter(adapterName);
    if (!adapter) {
      throw new Error(`Adapter ${adapterName} not found`);
    }
    return adapter.request(args);
  }

  /**
   * Connect using "kadena_connect".
   */
  public async connect(
    adapterName: Adapter['name'],
    params?: unknown,
  ): Promise<AccountInfo | null> {
    return this.getAdapterAsserted(adapterName).connect(params);
  }

  /**
   * Disconnect using "kadena_disconnect".
   */
  public async disconnect(adapterName: string): Promise<void> {
    await this.getAdapterAsserted(adapterName).disconnect();
  }

  /**
   * Retrieve the active account via "kadena_getAccount_v1".
   */
  public async getActiveAccount(adapterName: string): Promise<AccountInfo> {
    return this.getAdapterAsserted(adapterName).getActiveAccount();
  }

  /**
   * Retrieve all accounts (if multi-account is supported) via "kadena_getAccounts_v2".
   * Otherwise it will return a single Account wrapped in an Array.
   */
  public async getAccounts(adapterName: string): Promise<AccountInfo[]> {
    return this.getAdapterAsserted(adapterName).getAccounts();
  }

  /**
   * Retrieve the current network via "kadena_getNetwork_v1".
   */
  public async getActiveNetwork(adapterName: string): Promise<NetworkInfo> {
    return this.getAdapterAsserted(adapterName).getActiveNetwork();
  }

  /**
   * Retrieve all networks (if multi-network is supported) via "kadena_getNetworks_v1".
   * Otherwise it will return a single Network wrapped in an Array.
   */
  public async getNetworks(adapterName: string): Promise<NetworkInfo[]> {
    return this.getAdapterAsserted(adapterName).getNetworks();
  }

  /**
   * Sign transaction via "kadena_signTransaction".
   */
  public async signTransaction(
    adapterName: string,
    transaction: IUnsignedCommand | IUnsignedCommand[],
  ): Promise<(IUnsignedCommand | ICommand) | (IUnsignedCommand | ICommand)[]> {
    return this.getAdapterAsserted(adapterName).signTransaction(transaction);
  }

  /**
   * Sign command via "kadena_signCommand".
   */
  public async signCommand(
    adapterName: string,
    command: ISigningRequestPartial | IUnsignedCommand,
  ): Promise<ICommand | IUnsignedCommand> {
    return this.getAdapterAsserted(adapterName).signCommand(command);
  }

  /**
   * Subscribe to account change events.
   */
  public onAccountChange(
    adapterName: string,
    cb: (newAccount: AccountInfo) => void,
  ): void {
    this.getAdapterAsserted(adapterName).onAccountChange(cb);
  }

  /**
   * Subscribe to network change events.
   */
  public onNetworkChange(
    adapterName: string,
    cb: (newNetwork: NetworkInfo) => void,
  ): void {
    this.getAdapterAsserted(adapterName).onNetworkChange(cb);
  }

  /**
   * Change network via "kadena_changeNetwork_v1".
   */
  public async changeNetwork(
    adapterName: string,
    network: NetworkInfo,
  ): Promise<{ success: boolean; reason?: string }> {
    return this.getAdapterAsserted(adapterName).changeNetwork(network);
  }
}
