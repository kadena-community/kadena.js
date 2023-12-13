import { devnetConfig } from '@devnet/config';
import type { IAccount, IKeyPair } from '@devnet/helper';
import {
  inspect,
  listen,
  logger,
  sender00,
  signAndAssertTransaction,
  submit,
} from '@devnet/helper';
import type { ChainId, ICommand } from '@kadena/client';
import { Pact } from '@kadena/client';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { IMarmaladeNamespaceConfig } from './config/namespaces';
import type { IMarmaladeLocalConfig } from './config/repository';

export async function deployMarmamaladeNamespaces({
  localConfigData,
  namespacesConfig,
  sender = sender00,
  fileExtension,
}: {
  localConfigData: IMarmaladeLocalConfig;
  namespacesConfig: IMarmaladeNamespaceConfig[];
  sender?: IAccount;
  fileExtension: string;
}): Promise<void> {
  const publickeys = sender.keys.map((key) => key.publicKey);

  const namespaceFiles = readdirSync(localConfigData.namespacePath).filter(
    (file) => file.endsWith(fileExtension),
  );

  for (const config of namespacesConfig) {
    const namespaceFilename = namespaceFiles.find((file) =>
      file.includes(config.file),
    );
    if (!namespaceFilename) {
      throw new Error(`Namespace file ${config.file} not found`);
    }

    const namespaceFile = join(
      localConfigData.namespacePath,
      namespaceFilename,
    );

    await Promise.all(
      config.namespaces.map(async (namespace) => {
        let keysets;
        if (config.file === 'ns-contract-admin.pact') {
          keysets = [
            {
              name: `${namespace}.marmalade-contract-admin`,
              keys: publickeys,
              pred: 'keys-all',
            },
          ];
        } else if (config.file === 'fungible-util.pact') {
          keysets = [
            {
              name: 'util-ns-admin',
              keys: publickeys,
              pred: 'keys-all',
            },
          ];
        } else {
          keysets = [
            {
              name: 'marmalade-admin',
              keys: publickeys,
              pred: 'keys-all',
            },
            {
              name: 'marmalade-user',
              keys: publickeys,
              pred: 'keys-all',
            },
          ];
        }

        const transaction = await createPactCommandFromFile(namespaceFile, {
          namespace: {
            key: 'ns',
            data: namespace,
          },
          keysets,
        });

        logger.info(
          `Deploying namespace file ${config.file} for ${namespace}...}`,
        );

        const transactionDescriptor = await submit(transaction);
        const commandResult = await listen(transactionDescriptor);
        inspect('Result')(commandResult);
      }),
    );
  }
}

export async function createPactCommandFromFile(
  filepath: string,
  {
    chainId = devnetConfig.CHAIN_ID,
    networkId = devnetConfig.NETWORK_ID,
    signers = sender00.keys,
    meta = {
      gasLimit: 70000,
      chainId,
      ttl: 8 * 60 * 60,
      senderAccount: sender00.account,
    },
    keysets,
    namespace,
  }: {
    chainId?: ChainId;
    networkId?: string;
    signers?: IKeyPair[];
    meta?: {
      gasLimit: number;
      chainId: ChainId;
      ttl: number;
      senderAccount: string;
    };
    keysets?: { name: string; pred: string; keys: string[] }[];
    namespace?: { key: string; data: string };
  },
): Promise<ICommand> {
  const fileContent = readFileSync(filepath, 'utf8');

  let transactionBuilder = Pact.builder
    .execution(fileContent)
    .setMeta(meta)
    .setNetworkId(networkId);

  transactionBuilder = signers.reduce((builder, signer) => {
    return builder.addSigner(signer.publicKey);
  }, transactionBuilder);

  if (keysets) {
    transactionBuilder = keysets.reduce((builder, keyset) => {
      return builder.addKeyset(keyset.name, keyset.pred, ...keyset.keys);
    }, transactionBuilder);
  }

  if (namespace) {
    transactionBuilder = transactionBuilder.addData(
      namespace.key,
      namespace.data,
    );
  }

  const transaction = transactionBuilder.createTransaction();

  const signedTx = signAndAssertTransaction(signers)(transaction);
  return signedTx;
}
