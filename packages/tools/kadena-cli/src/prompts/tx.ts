import type {
  ICommand,
  ICommandPayload,
  IUnsignedCommand,
} from '@kadena/types';
import { z } from 'zod';
import {
  getTransactions,
  requestKeyValidation,
} from '../commands/tx/utils/txHelpers.js';

import { basename } from 'node:path';
import { getAllAccounts } from '../commands/account/utils/accountHelpers.js';
import { loadNetworkConfig } from '../commands/networks/utils/networkHelpers.js';
import { getTemplates } from '../commands/tx/commands/templates/templates.js';
import { MULTI_SELECT_INSTRUCTIONS } from '../constants/global.js';
import { services } from '../services/index.js';
import { CommandError } from '../utils/command.util.js';
import type { IPrompt } from '../utils/createOption.js';
import {
  isNotEmptyString,
  maskStringPreservingStartAndEnd,
  notEmpty,
} from '../utils/globalHelpers.js';
import { getExistingNetworks } from '../utils/helpers.js';
import { log } from '../utils/logger.js';
import { checkbox, input, select } from '../utils/prompts.js';
import { tableFormatPrompt } from '../utils/tableDisplay.js';
import { networkSelectPrompt } from './network.js';

const CommandPayloadStringifiedJSONSchema = z.string();
const PactTransactionHashSchema = z.string();

const ISignatureJsonSchema = z.object({
  sig: z.string(),
});

export const SignatureOrUndefinedOrNull = z.union([
  ISignatureJsonSchema,
  z.undefined(),
  z.null(),
]);

const chainWeaverSignatureSchema = z.record(z.string(), z.string().nullable());

const ICommandSignatureSchema = z.array(SignatureOrUndefinedOrNull);

export const ICommandSchema = z.object({
  cmd: CommandPayloadStringifiedJSONSchema,
  hash: PactTransactionHashSchema,
  sigs: ICommandSignatureSchema,
});

export const IUnsignedCommandSchema = z
  .object({
    cmd: CommandPayloadStringifiedJSONSchema,
    hash: PactTransactionHashSchema,
    sigs: ICommandSignatureSchema.or(chainWeaverSignatureSchema),
  })
  // Transform sings record to array
  .transform((value) => {
    if (Array.isArray(value.sigs)) {
      return value as z.output<typeof ICommandSchema>;
    }
    const sigs = chainWeaverSignatureSchema.safeParse(value.sigs);
    if (sigs.success) {
      const cmd = z
        .object({ signers: z.array(z.object({ pubKey: z.string() })) })
        .safeParse(JSON.parse(value.cmd));
      if (cmd.success) {
        const keys = cmd.data.signers.map((signer) => signer.pubKey);
        const result = {
          ...value,
          sigs: keys.map((key) =>
            sigs.data[key] !== null ? { sig: sigs.data[key] } : null,
          ),
        };
        return result;
      }
    }
    throw new Error('Invalid signature schema');
  });

export const ISignedCommandSchema = z.object({
  cmd: CommandPayloadStringifiedJSONSchema,
  hash: PactTransactionHashSchema,
  sigs: z.array(ISignatureJsonSchema),
});

export async function txUnsignedCommandPrompt(): Promise<IUnsignedCommand> {
  const result = await input({
    message: `Enter your transaction to sign:`,
    validate: (inputString) => {
      try {
        const parsedInput = JSON.parse(inputString);
        IUnsignedCommandSchema.parse(parsedInput);
        return true;
      } catch (error) {
        log.info('error', error);
        return 'Incorrect Format. Please enter a valid Unsigned Command.';
      }
    },
  });
  return JSON.parse(result) as IUnsignedCommand;
}

export const transactionSelectPrompt: IPrompt<string> = async (args) => {
  const signed = (args.signed as boolean) ?? false;
  const path = (args.path as string) ?? (args.directory as string);
  const existingTransactions: string[] = await getTransactions(signed, path);

  if (existingTransactions.length === 0) {
    throw new CommandError({
      warnings: [
        'No transactions found. Use "kadena tx add" to create a transaction, and "kadena tx sign" to sign it.',
      ],
    });
  }

  const choices = existingTransactions.map((transaction) => ({
    value: transaction,
    name: `Transaction: ${transaction}`,
  }));

  const selectedTransaction = await select({
    message: 'Select a transaction file:',
    choices: choices,
  });

  return selectedTransaction;
};

export const transactionsSelectPrompt: IPrompt<string[]> = async (args) => {
  const signed = (args.signed as boolean) ?? true;
  const path =
    (args.path as string) ?? (args.directory as string) ?? process.cwd();

  const fileExists = await services.filesystem.fileExists(path);
  if (fileExists) return [path];

  const existingTransactions: string[] = await getTransactions(signed, path);

  if (existingTransactions.length === 0) {
    throw new CommandError({
      warnings: [`No ${signed ? 'signed ' : ''}transactions found.`],
    });
  }

  const choices = existingTransactions.map((transaction) => ({
    value: transaction,
    name: `Transaction: ${transaction}`,
  }));

  const selectedTransaction = await checkbox({
    message: 'Select a transaction file:',
    choices: choices,
    pageSize: 10,
    required: true,
    instructions: MULTI_SELECT_INSTRUCTIONS,
  });

  return selectedTransaction;
};

// We don't want to prompt dir, but the flag is still available
// export async function txDirPrompt(): Promise<string> {
//   return await input({
//     message: `Enter your directory (default: working directory):`,
//     validate: async (input) => {
//       const dirExists = await services.filesystem.directoryExists(input);
//       if (!dirExists) {
//         return 'Directory or file not found. Please enter a valid directory or file path.';
//       }
//       return true;
//     },
//     default: `./`,
//   });
// }

export const selectTemplate: IPrompt<string> = async (args) => {
  const stdin = args.stdin as string | undefined;
  if (stdin !== undefined && stdin !== '') return '-';
  const templates = await getTemplates();
  const defaultTemplateKeys = Object.keys(templates);

  const choices = [
    {
      value: 'filepath',
      name: 'Select file path',
    },
    ...defaultTemplateKeys.map((x) => ({ value: x, name: x })),
  ];

  const result = await select({
    message: 'Which template do you want to use:',
    choices,
  });

  if (result === 'filepath') {
    const result = await input({
      message: 'File path:',
    });
    return result;
  }

  return result;
};

// aliases in templates need to select aliases for keys and/or accounts
// in account, we need to know what value exactly is expected. like public key, account name, or keyset
// the idea is to expect specific naming for the variables, like "account-from" or "pk-from" or "keyset-from"

const promptVariableValue = async (
  key: string,
  variables: Record<string, string>,
): Promise<string> => {
  if (key.startsWith('account:')) {
    // search for account alias - needs account implementation
    const accounts = await getAllAccounts().catch(() => []);

    const hasAccount = accounts.length > 0;
    let value: string | null = null;

    const choices = [
      {
        value: '_manual_',
        name: 'Enter account manually',
      },
      ...tableFormatPrompt([
        ...accounts.map((account) => ({
          value: account.name,
          name: [
            basename(account.alias, '.yaml'),
            maskStringPreservingStartAndEnd(account.name, 20),
            account.fungible,
            account.publicKeys
              .map((x) => maskStringPreservingStartAndEnd(x))
              .join(','),
            account.predicate,
          ],
        })),
      ]),
    ];
    if (hasAccount) {
      value = await select({
        message: `Select account alias for template value ${key}:`,
        choices,
      });
    }

    if (value === '_manual_' || !hasAccount) {
      const inputValue = await input({
        message: `Manual entry for account for template value ${key}:`,
        validate: (value) => {
          if (value === '') return `${key} cannot be empty`;
          return true;
        },
      });

      return inputValue;
    }

    if (value === null) throw new Error('account not found');

    log.info(`${log.color.green('>')} Using account name ${value}`);
    return value;
  } else if (key.startsWith('key:')) {
    const wallets = await services.wallet.list();
    const walletKeysCount = wallets.reduce(
      (acc, wallet) => acc + wallet.keys.length,
      0,
    );
    const plainKeys = await services.plainKey.list();
    const accounts = await getAllAccounts().catch(() => []);

    const hasKeys = walletKeysCount > 0 || plainKeys.length > 0;
    const hasAccounts = accounts.length > 0;
    let value: string | null = null;
    let targetSelection: string | null = null;

    //
    // Handle match between account and key variables
    //
    const pkName = key.replace('key:', '');
    const accountName = `account:${pkName}`;
    const accountMatch = variables[`account:${pkName}`];

    if (accountMatch) {
      const accounts = await getAllAccounts().catch(() => []);
      const accountConfig = accounts.find((x) => x.name === accountMatch);
      if (accountConfig) {
        const selection = await select({
          message: `Template key "${key}" matches account "${accountName}". Use public account's key?`,
          choices: [
            ...accountConfig.publicKeys.map((key) => ({
              value: key,
              name: `Account public key: ${key}`,
            })),
            {
              value: '_manual_',
              name: 'Enter public key manually',
            },
            hasAccounts
              ? {
                  value: '_account_',
                  name: 'Pick a public key from another account',
                }
              : undefined,
            hasKeys
              ? {
                  value: '_key_',
                  name: 'Pick a public key from keys',
                }
              : undefined,
          ].filter(notEmpty),
        });
        if (!selection.startsWith('_')) return selection;
        targetSelection = selection;
      }
    }

    // Choices for where to select public key from
    if (targetSelection === null) {
      const choices = [
        {
          value: '_manual_',
          name: 'Enter public key manually',
        },
        hasAccounts
          ? {
              value: '_account_',
              name: 'Pick a public key from another account',
            }
          : undefined,
        hasKeys
          ? {
              value: '_key_',
              name: 'Pick a public key from keys',
            }
          : undefined,
      ].filter(notEmpty);

      targetSelection =
        choices.length === 1
          ? choices[0].value
          : await select({
              message: `Template value "${key}" public key:`,
              choices: choices,
            });
    }

    // Pick from wallet keys or plain keys
    if (targetSelection === '_key_') {
      const choices = [] as { value: '_wallet_' | '_plain_'; name: string }[];
      if (walletKeysCount > 0)
        choices.push({ value: '_wallet_', name: 'Wallet keys' });
      if (plainKeys.length > 0)
        choices.push({ value: '_plain_', name: 'Plain keys' });
      const target =
        choices.length === 1
          ? choices[0].value
          : await select({
              message: `Select public key alias for template value ${key}:`,
              choices: choices,
            });
      if (target === '_wallet_') {
        const wallet =
          wallets.length === 1
            ? wallets[0]
            : await select({
                message: `Select wallet for template value ${key}:`,
                choices: wallets.map((wallet) => ({
                  value: wallet,
                  name: wallet.alias,
                })),
              });
        // Purposely did not auto-select if 1 key for transparency
        value = await select({
          message: `Select public key from wallet ${wallet.alias}:`,
          choices: [
            ...tableFormatPrompt([
              ...wallet.keys.map((key) => ({
                value: key.publicKey,
                name: [key.index.toString(), key.alias ?? '', key.publicKey],
              })),
            ]),
          ],
        });
      } else if (target === '_plain_') {
        // Purposely did not auto-select if 1 key for transparency
        value = await select({
          message: `Select public key from plain keys:`,
          choices: plainKeys.map((key) => ({
            value: key.publicKey,
            name: key.publicKey,
          })),
        });
      }
    }

    // Pick public key from accounts
    if (targetSelection === '_account_') {
      const accountName = await select({
        message: `Select account alias for template value ${key}:`,
        choices: [
          ...tableFormatPrompt([
            ...accounts.map((account) => ({
              value: account.name,
              name: [
                basename(account.alias, '.yaml'),
                maskStringPreservingStartAndEnd(account.name, 20),
                account.fungible,
                account.publicKeys
                  .map((x) => maskStringPreservingStartAndEnd(x))
                  .join(','),
                account.predicate,
              ],
            })),
          ]),
        ],
      });
      const account = accounts.find((x) => x.name === accountName)!;
      if (account.publicKeys.length === 1) {
        value = account.publicKeys[0];
      } else {
        value = await select({
          message: `Select public key for template value ${key}:`,
          choices: [
            ...account.publicKeys.map((key) => ({
              value: key,
              name: `Account key: ${key}`,
            })),
          ],
        });
      }
    }

    // Fallback: manual entry if nothing else is selected
    if (value === null) {
      value = await input({
        message: `Manual entry for public key for template value ${key}:`,
        validate: (value) => {
          if (value === '') return `${key} cannot be empty`;
          return true;
        },
      });
    }

    if (value === null || value === '_manual_') {
      throw new Error('public key not found');
    }

    log.info(`${log.color.green('>')} Using public key ${value}`);
    return value;
  } else if (key.startsWith('keyset-')) {
    // TODO: search for key alias - needs account implementation
    const alias = await input({
      message: `Template value for keyset ${key}:`,
      validate: (value) => {
        if (value === '') return `${key} cannot be empty`;
        return true;
      },
    });
    log.info('keyset alias', alias);
    return alias;
  } else if (key.startsWith('network:')) {
    const keyName = key.substring('network:'.length);
    const networks = await getExistingNetworks();
    const networkName = await select({
      message: `Select network id for template value ${keyName}:`,
      choices: networks,
    });
    const network = await loadNetworkConfig(networkName);
    return network.networkId;
  }

  const result = await input({
    message: `Template value ${key}:`,
    validate: (value) => {
      if (value === '') return `${key} cannot be empty`;
      if (key.startsWith('decimal:') && !/^\d+\.\d+$/.test(value)) {
        return 'Decimal value must be in the format 1.0';
      }
      return true;
    },
  });

  return result;
};

export const templateVariables: IPrompt<Record<string, string>> = async (
  args,
) => {
  const values = args.values as string[] | undefined;
  const variables = args.variables as string[] | undefined;
  const data = args.data as Record<string, string | number>;

  if (!values || !variables) return {};

  const variableValues = {} as Record<string, string>;

  for (const variable of variables) {
    // Prioritize variables from data file
    if (Object.hasOwn(data, variable)) {
      variableValues[variable] = String(data[variable]);
      continue;
    }
    // Find variables in cli arguments
    const match = values.find((value) => value.startsWith(`--${variable}=`));
    if (match !== undefined) variableValues[variable] = match.split('=')[1];
    else {
      // Prompt for variable value
      variableValues[variable] = await promptVariableValue(
        variable,
        variableValues,
      );
    }
  }

  return variableValues;
};

export const outFilePrompt: IPrompt<string | null> = async (args) => {
  const result = await input({
    message: 'Where do you want to save the output:',
  });
  return result ?? null;
};

export const templateDataPrompt: IPrompt<string | null> = async () => {
  const result = await input({
    message: 'File path of data to use for template .json or .yaml (optional):',
  });
  return result ?? null;
};

export async function selectSignMethodPrompt(): Promise<'wallet' | 'keyPair'> {
  return await select({
    message: 'Select an action:',
    choices: [
      {
        value: 'wallet',
        name: 'Sign with wallet',
      },
      {
        value: 'keyPair',
        name: 'Sign with key pair',
      },
    ],
  });
}

function determineNetwork(networkId: string | null): string {
  const id = networkId ?? '';

  if (id.includes('testnet')) {
    return 'testnet';
  } else if (id.includes('mainnet')) {
    return 'mainnet';
  } else if (id.includes('development')) {
    return 'devnet';
  }
  return '';
}

export const txTransactionNetworks: IPrompt<string[]> = async (
  args: Record<string, unknown>,
) => {
  const commands: (IUnsignedCommand | ICommand)[] = args.commands as (
    | IUnsignedCommand
    | ICommand
  )[];

  const networkPerTransaction: string[] = [];
  for (const [index, command] of commands.entries()) {
    const cmdPayload: ICommandPayload = JSON.parse(command.cmd);
    let network = determineNetwork(cmdPayload.networkId);

    if (network === '') {
      network = await networkSelectPrompt(
        {},
        { networkText: `Select network for transaction ${index + 1}:` },
        false,
      );
    }

    networkPerTransaction.push(network);
  }

  return networkPerTransaction;
};

export const txRequestKeyPrompt: IPrompt<string> = async () => {
  return await input({
    message: 'Enter transaction request key:',
    validate: (value) => {
      if (!isNotEmptyString(value.trim())) {
        return 'Request key cannot be empty';
      }

      const parse = requestKeyValidation.safeParse(value);
      if (parse.success) return true;

      const formatted = parse.error.format();
      return formatted._errors[0];
    },
  });
};
