import { Option } from 'commander';

import { load as loadYaml } from 'js-yaml';
import { join } from 'node:path';
import { z } from 'zod';
import { TRANSACTION_FOLDER_NAME } from '../constants/config.js';
import { tx } from '../prompts/index.js';
import { templateDataPrompt, templateVariables } from '../prompts/tx.js';
import { services } from '../services/index.js';
import { createOption } from '../utils/createOption.js';
import { isNotEmptyString } from '../utils/helpers.js';
import { log } from '../utils/logger.js';
import { getTemplate } from './commands/templates/templates.js';
import { getTemplateVariables } from './utils/template.js';
import { parseCommaSeparatedInput } from './utils/txHelpers.js';

export const txOptions = {
  selectTemplate: createOption({
    key: 'template',
    option: new Option('--template <template>', 'select a template'),
    validation: z.string(),
    prompt: tx.selectTemplate,
    async expand(templateInput: string, args) {
      // option 1. --template="transfer.yaml"
      // option 2. --template="./transfer.ktpl"
      // option 3. cat send.yaml | kadena tx create-transaction

      let template: string;

      if (templateInput === '-' && isNotEmptyString(args.stdin)) {
        log.debug('using stdin');
        template = args.stdin;
      } else {
        template = await getTemplate(templateInput);
      }

      if (template === undefined) {
        // not in template list, try to load from file
        const templatePath = join(process.cwd(), templateInput);
        const file = await services.filesystem.readFile(templatePath);

        if (file === null) {
          // not in file either, error
          throw Error(`Template "${templateInput}" not found`);
        }

        template = file;
      }

      const variables = getTemplateVariables(template);

      return { template, variables };
    },
  }),
  templateData: createOption({
    key: 'templateData',
    validation: z.string(),
    option: new Option('--template-data <templateData>', 'template data file'),
    prompt: templateDataPrompt,
    async expand(filePath) {
      const absolutePath = join(process.cwd(), filePath);
      const exists = await services.filesystem.fileExists(absolutePath);
      const file = await services.filesystem.readFile(
        exists ? absolutePath : filePath,
      );
      if (file === null) return null;
      let parsed: unknown;
      try {
        parsed = JSON.parse(file) as unknown;
        // eslint-disable-next-line no-empty
      } catch (e) {}
      try {
        parsed = loadYaml(file) as unknown;
        // eslint-disable-next-line no-empty
      } catch (e) {}
      const validated = z
        .record(z.union([z.string(), z.number()]))
        .safeParse(parsed);
      if (validated.success) return validated.data;
      else return null;
    },
  }),
  templateVariables: createOption({
    key: 'templateVariables',
    validation: z.object({}).passthrough(),
    option: new Option(
      '--template-variables <templateVariables>',
      'template variables',
    ),
    prompt: templateVariables,
    allowUnknownOptions: true,
  }),

  txUnsignedCommand: createOption({
    key: 'txUnsignedCommand',
    prompt: tx.txUnsignedCommandPrompt,
    validation: tx.IUnsignedCommandSchema,
    option: new Option(
      '-m, --tx-unsigned-command <txUnsignedCommand>',
      'enter your unsigned command to sign',
    ),
  }),
  txUnsignedTransactionFile: createOption({
    key: 'txUnsignedTransactionFile',
    prompt: tx.transactionSelectPrompt,
    validation: tx.IUnsignedCommandSchema,
    option: new Option(
      '-u, --tx-unsigned-transaction-file <txUnsignedTransactionFile>',
      'provide your unsigned transaction file to sign',
    ),
  }),
  txUnsignedTransactionFiles: createOption({
    key: 'txUnsignedTransactionFiles',
    prompt: tx.transactionsSelectPrompt,
    validation: z.array(z.string()),
    option: new Option(
      '-u, --tx-unsigned-transaction-files <txUnsignedTransactionFiles>',
      'provide your unsigned transaction file(s) to sign',
    ),
    transform: async (
      txUnsigedTransactionFiles: string | string[],
    ): Promise<string[]> => {
      if (typeof txUnsigedTransactionFiles === 'string') {
        return parseCommaSeparatedInput(txUnsigedTransactionFiles);
      }
      return txUnsigedTransactionFiles;
    },
  }),
  txSignedTransactionFile: createOption({
    key: 'txSignedTransactionFile',
    prompt: tx.transactionSelectPrompt,
    validation: tx.ICommandSchema,
    option: new Option(
      '-s, --tx-signed-transaction-file <txSignedTransactionFile>',
      'provide your signed transaction file',
    ),
  }),
  txSignedTransactionFiles: createOption({
    key: 'txSignedTransactionFiles',
    prompt: tx.transactionsSelectPrompt,
    validation: z.union([z.array(z.string()), z.string()]),
    option: new Option(
      '-s, --tx-signed-transaction-files <txSignedTransactionFiles>',
      'provide your signed transaction file',
    ),
    transform: async (
      txSignedTransactionFiles: string | string[],
    ): Promise<string[]> => {
      if (typeof txSignedTransactionFiles === 'string') {
        return parseCommaSeparatedInput(txSignedTransactionFiles);
      }
      return txSignedTransactionFiles;
    },
  }),
  txTransactionDir: createOption({
    key: 'txTransactionDir' as const,
    prompt: tx.txTransactionDirPrompt,
    validation: z.string(),
    option: new Option(
      '-d, --tx-transaction-dir <txTransactionDir>',
      `Enter your transaction directory (default: "./${TRANSACTION_FOLDER_NAME}")`,
    ),
  }),
  directory: createOption({
    key: 'directory' as const,
    prompt: tx.txDirPrompt,
    validation: z.string().optional(),
    option: new Option(
      '--directory <directory>',
      `Enter your directory (default: working directory)`,
    ),
  }),
};
