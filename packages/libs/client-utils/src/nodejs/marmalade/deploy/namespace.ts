import { ChainId } from '@kadena/types';
import { readdirSync } from 'fs';
import { join } from 'path';
import { deployContract } from '../../../built-in/deployContract';
import { IAccount, IClientConfig } from '../../../core/utils/helpers';
import {
  defaultAccount,
  defaultChainId,
  defaultNetworkId,
} from '../utils/defaults';
import { INamespaceConfig } from './config';

export const defaultNamespaceConfig: INamespaceConfig[] = [
  {
    file: 'ns-marmalade.pact',
    namespaces: ['marmalade-v2', 'marmalade-sale', 'kip', 'util'],
  },
  {
    file: 'ns-contract-admin.pact',
    namespaces: ['marmalade-v2', 'marmalade-sale'],
  },
  { file: 'guards1.pact', namespaces: ['util'] },
];

export interface IDeployMarmaladeNamespacesInput {
  sender?: IAccount;
  chainId?: ChainId;
  networkId?: string;
  namespaceFilesPath: string;
  fileExtension?: string;
  namespaceConfig: INamespaceConfig[];
  clientConfig: IClientConfig;
}

export const deployMarmaladeNamespaces = async ({
  sender = defaultAccount,
  chainId = defaultChainId,
  networkId = defaultNetworkId,
  namespaceFilesPath,
  fileExtension = 'pact',
  namespaceConfig = defaultNamespaceConfig,
  clientConfig,
}: IDeployMarmaladeNamespacesInput) => {
  const namespaceFiles = readdirSync(namespaceFilesPath).filter((file) =>
    file.endsWith(fileExtension),
  );

  for (const config of namespaceConfig) {
    const namespaceFilename = namespaceFiles.find((file) =>
      file.includes(config.file),
    );
    if (!namespaceFilename) {
      throw new Error(`Namespace file ${config.file} not found`);
    }

    const namespaceFile = join(namespaceFilesPath, namespaceFilename);

    await Promise.all(
      config.namespaces.map(async (namespace) => {
        let keysets;
        const keys = sender.publicKeys || [];
        const pred = 'keys-all';

        /* We need to define the keysets for each namespace since
          they are different */
        if (config.file === 'ns-contract-admin.pact') {
          keysets = [
            {
              name: `${namespace}.marmalade-contract-admin`,
              keys,
              pred,
            },
          ];
        } else if (config.file === 'fungible-util.pact') {
          keysets = [
            {
              name: 'util-ns-admin',
              keys,
              pred,
            },
          ];
        } else {
          keysets = [
            {
              name: 'marmalade-admin',
              keys,
              pred,
            },
            {
              name: 'marmalade-user',
              keys,
              pred,
            },
          ];
        }

        const result = await deployContract(
          {
            contractCode: namespaceFile,
            transactionBody: {
              chainId,
              keysets,
              namespace: {
                key: 'ns',
                data: namespace,
              },
              signers: keys,
              networkId,
              meta: {
                gasLimit: 70000,
                chainId,
                ttl: 8 * 60 * 60,
                senderAccount: sender.account,
              },
            },
          },
          clientConfig,
        ).execute();

        if (result?.result.status !== 'success') {
          throw new Error(
            `Failed to deploy namespace ${namespace} from file ${namespaceFile}`,
          );
        } else {
          console.log(
            `Sucessfully deployed namespace ${namespace} from file ${namespaceFile}`,
          );
        }
      }),
    );
  }
};

// export async function createPactCommandFromFile(
//   filepath: string,
//   {
//     chainId,
//     networkId = 'fast-development',
//     signers = [
//       {
//         publicKey: defaultAccount.publicKeys?.[0] ?? '',
//         secretKey: defaultAccount.secretKey,
//       },
//     ],
//     meta = {
//       gasLimit: 70000,
//       chainId,
//       ttl: 8 * 60 * 60,
//       senderAccount: defaultAccount.account,
//     },
//     keysets,
//     namespace,
//   }: {
//     chainId: ;
//     networkId?: string;
//     signers?: IKeyPair[];
//     meta?: {
//       gasLimit: number;
//       chainId: ChainId;
//       ttl: number;
//       senderAccount: string;
//     };
//     keysets?: { name: string; pred: string; keys: string[] }[];
//     namespace?: { key: string; data: string };
//   },
// ): Promise<ICommand> {
//   const fileConChainIdtent = readFileSync(filepath, 'utf8');

//   let transactionBuilder = Pact.builder
//     .execution(fileContent)
//     .setMeta(meta)
//     .setNetworkId(networkId);

//   transactionBuilder = signers.reduce((builder, signer) => {
//     return builder.addSigner(signer.publicKey);
//   }, transactionBuilder);

//   if (keysets) {
//     transactionBuilder = keysets.reduce((builder, keyset) => {
//       return builder.addKeyset(keyset.name, keyset.pred, ...keyset.keys);
//     }, transactionBuilder);
//   }

//   if (namespace) {
//     transactionBuilder = transactionBuilder.addData(
//       namespace.key,
//       namespace.data,
//     );
//   }

//   const transaction = transactionBuilder.createTransaction();

//   const signedTx = await signAndAssertTransaction(signers)(transaction);
//   return signedTx;
// }
