import type {
  IBuilder,
  IClient,
  ICommand,
  IKeyPair,
  ITransactionDescriptor,
  IUnsignedCommand,
} from '@kadena/client';
import {
  Pact,
  createClient,
  createSignWithKeypair,
  isSignedTransaction,
} from '@kadena/client';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import type {
  KeysetConfig,
  NetworkConfig,
  PactToolboxConfigObj,
} from '../config';
import {
  createRpcUrlGetter,
  defaultMeta,
  getNetworkConfig,
  isPactServerNetworkConfig,
} from '../config';
import { getCmdDataOrFail } from '../utils';

export interface DeployContractParams {
  upgrade?: boolean;
  preflight?: boolean;
  listen?: boolean;
  init?: boolean;
  namespace?: string;
  keysets?: Record<string, KeysetConfig>;
  signer?: string;
  data?: Record<string, unknown>;
  caps?: string[][];
  skipSign?: boolean;
}

export interface LocalOptions {
  preflight?: boolean;
  signatureVerification?: boolean;
}

export class PactToolboxClient {
  private kdaClient: IClient;
  private networkConfig: NetworkConfig;

  constructor(
    private config: PactToolboxConfigObj,
    network?: string,
  ) {
    this.networkConfig = getNetworkConfig(config, network);
    this.kdaClient = createClient(createRpcUrlGetter(this.networkConfig));
  }

  get network() {
    return this.networkConfig;
  }

  isPactServerNetwork() {
    return isPactServerNetworkConfig(this.networkConfig);
  }

  isChainwebNetwork() {
    return this.networkConfig.type.includes('chainweb');
  }

  getContactsDir() {
    return this.config.contractsDir ?? 'pact';
  }

  getScriptsDir() {
    return this.config.scriptsDir ?? 'scripts';
  }

  getPreludeDir() {
    return join(this.getContactsDir(), 'prelude');
  }

  getConfig() {
    return this.config;
  }

  getSigner(address: string = this.networkConfig.senderAccount) {
    const s = this.networkConfig.signers.find((s) => s.account === address);
    if (!s) {
      throw new Error(`Signer ${address} not found in network accounts`);
    }
    return s;
  }

  execution<T extends IBuilder<any>>(command: string): T {
    return Pact.builder
      .execution(command)
      .setMeta({
        ...defaultMeta,
        chainId: this.networkConfig.chainId,
        senderAccount: this.networkConfig.senderAccount,
        ttl: this.networkConfig.ttl,
        gasLimit: this.networkConfig.gasLimit,
        gasPrice: this.networkConfig.gasPrice,
      })
      .setNetworkId(this.networkConfig.networkId) as T;
  }

  async sign(tx: IUnsignedCommand, keyPair?: IKeyPair) {
    const senderKeys =
      keyPair ?? this.getSigner(this.networkConfig.senderAccount);
    if (!senderKeys) {
      throw new Error(
        `Signer ${this.networkConfig.senderAccount} not found in network accounts`,
      );
    }
    return createSignWithKeypair(senderKeys)(tx);
  }

  async dirtyRead<T>(tx: IUnsignedCommand | ICommand) {
    const res = await this.kdaClient.dirtyRead(tx);
    return getCmdDataOrFail<T>(res);
  }

  async local<T>(tx: IUnsignedCommand | ICommand, options?: LocalOptions) {
    const res = await this.kdaClient.local(tx, options);
    return getCmdDataOrFail<T>(res);
  }

  async preflight(
    tx: IUnsignedCommand | ICommand,
  ): ReturnType<IClient['preflight']> {
    return this.kdaClient.preflight(tx);
  }

  async submit(tx: ICommand | IUnsignedCommand) {
    if (isSignedTransaction(tx)) {
      return this.kdaClient.submit(tx);
    } else {
      throw new Error('Transaction must be signed');
    }
  }

  async listen<T>(request: ITransactionDescriptor) {
    const res = await this.kdaClient.listen(request);
    return getCmdDataOrFail<T>(res);
  }

  async submitAndListen<T>(tx: ICommand | IUnsignedCommand) {
    if (isSignedTransaction(tx)) {
      const request = await this.kdaClient.submit(tx);
      const response = await this.kdaClient.listen(request);
      return getCmdDataOrFail<T>(response);
    } else {
      throw new Error('Transaction must be signed');
    }
  }

  async runPact(code: string, data: Record<string, any> = {}) {
    const builder = this.execution(code);
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        builder.addData(key, value);
      }
    }
    return this.kdaClient.dirtyRead(builder.createTransaction());
  }

  async deployCode(
    code: string,
    {
      upgrade = false,
      preflight = false,
      init = false,
      namespace,
      keysets,
      data,
      signer = this.networkConfig.senderAccount,
      caps = [],
      skipSign = false,
      listen = true,
    }: DeployContractParams = {},
  ) {
    const txBuilder = this.execution(code)
      .addData('upgrade', upgrade)
      .addData('init', init);
    if (signer && !skipSign) {
      const signerKeys = this.getSigner(signer);
      if (!signerKeys) {
        throw new Error(`Signer ${signer} not found in network accounts`);
      }
      txBuilder.addSigner(signerKeys.publicKey, (signFor) =>
        caps.map((capArgs) => signFor.apply(null, capArgs as any)),
      );
    }

    if (namespace) {
      txBuilder.addData('namespace', namespace);
      txBuilder.addData('ns', namespace);
    }

    if (typeof keysets === 'object') {
      for (const [keysetName, keyset] of Object.entries(keysets)) {
        txBuilder.addKeyset(keysetName, keyset.pred, ...keyset.keys);
      }
    }

    if (data) {
      for (const [key, value] of Object.entries(data)) {
        txBuilder.addData(key, value as any);
      }
    }

    let tx = txBuilder.createTransaction();
    if (!skipSign) {
      tx = await this.sign(tx);
    }

    if (preflight) {
      const res = await this.preflight(tx);
      if (res.preflightWarnings) {
        console.warn('Preflight warnings:', res.preflightWarnings?.join('\n'));
      }
    }

    return listen ? this.submitAndListen(tx) : this.submit(tx);
  }

  async describeModule(module: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return this.runPact(`(describe-module "${module}")`);
  }

  async describeNamespace(namespace: string) {
    return this.runPact(`(describe-namespace "${namespace}")`);
  }

  async isNamespaceDefined(namespace: string) {
    const res = await this.describeNamespace(namespace);
    if (res.result.status === 'success') {
      return true;
    }
    return false;
  }

  async isContractDeployed(module: string) {
    const res = await this.describeModule(module);
    if (res.result.status === 'success') {
      return true;
    }
    return false;
  }

  async getContractCode(contractPath: string) {
    const contractsDir = this.config.contractsDir ?? 'pact';
    contractPath = contractPath.startsWith(contractsDir)
      ? contractPath
      : join(contractsDir, contractPath);
    try {
      await stat(contractPath);
    } catch (e) {
      throw new Error(`Contract file not found: ${contractPath}`);
    }
    return readFile(contractPath, 'utf-8');
  }

  async deployContract(contract: string, params?: DeployContractParams) {
    const contractCode = await this.getContractCode(contract);
    return this.deployCode(contractCode, params);
  }

  async deployContracts(contracts: string[], params?: DeployContractParams) {
    return Promise.all(contracts.map((c) => this.deployContract(c, params)));
  }
}
