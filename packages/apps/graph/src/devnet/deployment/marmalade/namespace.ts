import type { IAccount } from '@devnet/utils';
import { sender00 } from '@devnet/utils';
import type { ChainId, ICommand, IKeyPair } from '@kadena/client';
import { Pact } from '@kadena/client';
import { logger } from '@utils/logger';
import { networkData } from '@utils/network';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { inspect, listen, signAndAssertTransaction, submit } from '../helper';
import type { IMarmaladeNamespaceConfig } from './config/namespaces';
import type { IMarmaladeLocalConfig } from './config/repository';

export async function deployMarmamaladeNamespaces({
  localConfigData,
  namespacesConfig,
  sender = sender00,
  fileExtension,
  chainId,
}: {
  localConfigData: IMarmaladeLocalConfig;
  namespacesConfig: IMarmaladeNamespaceConfig[];
  sender?: IAccount;
  fileExtension: string;
  chainId: ChainId;
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
        /* The keysets for each file are hardcoded here for the ns-contract-admin and fungible-util files
        By default they will be marmalade-admin and marmalade-user */
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
          chainId,
        });

        logger.info(`Deploying namespace file ${config.file} for ${namespace}`);

        const transactionDescriptor = await submit(transaction);
        const commandResult = await listen(transactionDescriptor);

        if (commandResult.result.status !== 'success') {
          inspect('Result')(commandResult);
        } else {
          logger.info(
            `Sucessfully deployed namespace file ${config.file} for ${namespace}`,
          );
        }
      }),
    );
  }
}

export async function createPactCommandFromFile(
  filepath: string,
  {
    chainId,
    networkId = networkData.networkId,
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
    chainId: ChainId;
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

  const signedTx = await signAndAssertTransaction(signers)(transaction);
  return signedTx;
}
