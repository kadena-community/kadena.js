import { Option } from 'commander';
import { z } from 'zod';
import { tx } from '../prompts/index.js';
import { services } from '../services/index.js';

import type { ICommand, IUnsignedCommand } from '@kadena/types';
import { join } from 'node:path';

import { TRANSACTION_DIR } from '../constants/config.js';

import { createOption } from './createOption.js';

type TransformReturnType = Promise<{
  transactionFile: string;
  signedCommand?: ICommand;
  unsignedCommand?: IUnsignedCommand;
}>;

type TxSignedTransaction = 'txSignedTransaction';

type TxTransaction = 'txTransaction';

type KeyBasedOnSigned<Signed extends boolean> = Signed extends true
  ? TxSignedTransaction
  : TxTransaction;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createTransactionOption<Signed extends boolean>(
  signed: Signed,
) {
  const key = (
    signed ? 'txSignedTransaction' : 'txTransaction'
  ) as KeyBasedOnSigned<Signed>;

  const flag = signed ? '-s, --tx-signed-transaction' : '-t, --tx-transaction';

  const option = new Option(
    `${flag} <transactionFile>`,
    `Please select your ${signed ? 'signed' : 'unsigned'} transaction file`,
  );

  const prompt = async (): Promise<string> => {
    return tx.transactionSelectPrompt(signed);
  };

  const validation = z.string();

  const transform = async (transactionFile: string): TransformReturnType => {
    try {
      const transactionFilePath = join(TRANSACTION_DIR, transactionFile);
      const fileContent =
        await services.filesystem.readFile(transactionFilePath);

      if (fileContent === null) {
        throw Error(`Failed to read file at path: ${transactionFilePath}`);
      }
      const transaction = JSON.parse(fileContent);

      if (signed) {
        tx.ICommandSchema.parse(transaction);
        return {
          transactionFile,
          signedCommand: transaction as ICommand,
        };
      }
      tx.IUnsignedCommandSchema.parse(transaction);
      return {
        transactionFile,
        unsignedCommand: transaction as IUnsignedCommand,
      };
    } catch (error) {
      console.error(
        `Error processing ${
          signed ? 'signed' : 'unsigned'
        } transaction file: ${transactionFile}, failed with error: ${error}`,
      );

      throw error;
    }
  };

  return createOption({
    key,
    prompt,
    validation,
    option,
    transform,
  });
}
