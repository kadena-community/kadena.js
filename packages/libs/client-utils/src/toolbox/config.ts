import type {
  IBuilder,
  IClient,
  IContinuationPayloadObject,
  ISignFunction,
} from '@kadena/client';
import { Pact, createClient, createSignWithKeypair } from '@kadena/client';
import { genKeyPair } from '@kadena/cryptography-utils';
import type { ChainId, IKeyPair } from '@kadena/types';
import { setGlobalConfig } from '../core';
import type { IClientConfig } from '../core/utils/helpers';

export interface Signer extends IKeyPair {
  account: string;
}

interface ToolboxNetworkMeta {
  chainId: ChainId;
  sender?: string;
  gasLimit?: number;
  gasPrice?: number;
  ttl?: number;
}
export interface ToolboxClientNetworkConfig {
  networkId: string;
  rpcUrl: string;
  senderAccount: string;
  defaultSigner: Signer;
  signers: Signer[];
  type: string;
  name: string;
  meta: ToolboxNetworkMeta;
}

export function isToolboxInstalled() {
  return (
    typeof (globalThis as any).__KADENA_TOOLBOX_NETWORK_CONFIG__ === 'object'
  );
}

export function getToolboxNetworkConfig(): ToolboxClientNetworkConfig {
  if (!isToolboxInstalled()) {
    throw new Error(
      'Make sure you are using the pact-toolbox bundler plugin, eg `@pact-toolbox/unplugin`',
    );
  }
  return (globalThis as any).__KADENA_TOOLBOX_NETWORK_CONFIG__;
}

export function createKadenaClient() {
  let kdaClient: IClient;
  return () => {
    const config = getToolboxNetworkConfig();
    if (!kdaClient) {
      kdaClient = createClient(
        ({ networkId = config.networkId, chainId = config.meta.chainId }) =>
          config.rpcUrl.replace(/{networkId}|{chainId}/g, (match: string) =>
            match === '{networkId}' ? networkId : chainId,
          ),
      );
    }
    return kdaClient;
  };
}

export function getToolboxClientUtilsDefaults(): Partial<IClientConfig> {
  try {
    const network = getToolboxNetworkConfig();
    return {
      host: ({
        networkId = network.networkId,
        chainId = network.meta.chainId,
      }) =>
        network.rpcUrl.replace(/{networkId}|{chainId}/g, (match: string) =>
          match === '{networkId}' ? networkId : chainId,
        ),
      defaults: {
        meta: network.meta,
        networkId: network.networkId,
        signers: [
          {
            pubKey: network.defaultSigner.publicKey,
            address: network.defaultSigner.account,
            scheme: 'ED25519',
          },
        ],
      },
      sign: createSignWithPactToolbox(),
    };
  } catch (e) {
    return {};
  }
}

export function setupToolboxClientUtilsConfig() {
  setGlobalConfig(getToolboxClientUtilsDefaults());
}

export function createSignWithPactToolbox(signer?: string): ISignFunction {
  let sign: ISignFunction;
  return ((transactions) => {
    const signerAccount = getSignerAccount(signer);
    if (!sign) {
      sign = createSignWithKeypair(signerAccount);
    }
    return sign(transactions as any);
  }) as ISignFunction;
}

export function addDefaultMeta<T extends IBuilder<any>>(builder: T): T {
  const network = getToolboxNetworkConfig();
  return builder.setNetworkId(network.networkId).setMeta(network.meta) as T;
}

export function getSignerAccount(signer?: string) {
  const network = getToolboxNetworkConfig();
  signer = signer || network.senderAccount || 'sender00';
  const signerAccount = network.signers.find((s) => s.account === signer);
  if (!signerAccount) {
    throw new Error(`Signer ${signer} not found in network config`);
  }
  return signerAccount;
}

export function execution<T extends IBuilder<any>>(command: string): T {
  return addDefaultMeta(Pact.builder.execution(command)) as T;
}

export function continuation<
  T extends IBuilder<{
    payload: IContinuationPayloadObject;
  }>,
>(command: Parameters<typeof Pact.builder.continuation>[0]): T {
  return addDefaultMeta(Pact.builder.continuation(command)) as T;
}

export function getAccountKey(account: string) {
  return account.split(':')[1];
}

export function generateKAccount() {
  const { publicKey, secretKey } = genKeyPair();
  return {
    publicKey,
    secretKey,
    account: `k:${publicKey}`,
  };
}

export function generateKAccounts(count = 10) {
  return Array.from({ length: count }, () => generateKAccount());
}

export function pactDecimal(amount: string | number) {
  return {
    decimal: typeof amount === 'string' ? amount : amount.toFixed(12),
  };
}
