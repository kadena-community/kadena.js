import { Option } from 'commander';
import { z } from 'zod';
import { pactjs } from '../../../prompts/index.js';
import { createOption } from '../../../utils/createOption.js';

const asList = (value: string | string[]): string[] => {
  if (typeof value === 'string') {
    if (value.trim().length === 0) {
      return [];
    }
    value = value
      .split(',')
      .map((item: string) => item.trim())
      .filter((item) => item.length > 0);
  }

  if (Array.isArray(value) && value.length === 0) {
    return [];
  }

  return value;
};

export const contractOptions = {
  clean: createOption({
    key: 'clean' as const,
    prompt: pactjs.cleanPrompt,
    validation: z.string(),
    option: new Option('-c, --clean <clean>', 'Clean existing generated files'),
  }),
  capsInterface: createOption({
    key: 'capsInterface' as const,
    prompt: pactjs.capsInterfacePrompt,
    validation: z.string().optional(),
    option: new Option(
      '-i, --caps-interface <capsInterface>',
      'Custom name for the interface of the caps',
    ),
  }),
  fileOrDirectory: createOption({
    key: 'fileOrDirectory' as const,
    prompt: pactjs.fileOrDirectoryPrompt,
    validation: z.string().optional(),
    option: new Option(
      '-d, --file-or-directory <fileOrDirectory>',
      'File or directory to use to generate the client',
    ),
    transform: asList,
  }),
  file: createOption({
    key: 'file' as const,
    prompt: pactjs.filePrompt,
    validation: z.string().optional(),
    option: new Option(
      '-f, --file <file>',
      'Generate d.ts from Pact contract file',
    ),
    transform: asList,
  }),
  contract: createOption({
    key: 'contract' as const,
    prompt: pactjs.contractPrompt,
    validation: z.string().optional(),
    option: new Option(
      '-c, --contract <contract>',
      'Generate d.ts from Pact contract from the blockchain',
    ),
    transform: asList,
  }),
  namespace: createOption({
    key: 'namespace' as const,
    prompt: pactjs.namespacePrompt,
    validation: z.string().optional(),
    option: new Option(
      '-n, --namespace <namespace>',
      'Namespace for the contract',
    ),
  }),
  api: createOption({
    key: 'api' as const,
    prompt: pactjs.apiPrompt,
    validation: z.string().optional(),
    option: new Option('-a, --api <api>', 'API to retrieve the contract'),
  }),
  module: createOption({
    key: 'module' as const,
    prompt: pactjs.modulePrompt,
    validation: z.string(),
    option: new Option(
      '-m, --module <module>',
      'The module you want to retrieve (e.g. "coin")',
    ),
  }),
  out: createOption({
    key: 'out' as const,
    prompt: pactjs.outPrompt,
    validation: z.string(),
    option: new Option('-o, --out <out>', 'File to write the contract to'),
  }),
  chain: createOption({
    key: 'chain' as const,
    prompt: pactjs.chainPrompt,
    validation: z.number().optional(),
    option: new Option(
      '-c, --chain <chain>',
      'Chain ID to retrieve the contract from',
    ),
  }),
  network: createOption({
    key: 'network' as const,
    prompt: pactjs.networkPrompt,
    validation: z.string().optional(),
    option: new Option(
      '-n, --network <network>',
      'Network ID to retrieve the contract from',
    ),
  }),
  parseTreePath: createOption({
    key: 'parseTreePath' as const,
    prompt: pactjs.parseTreePathPrompt,
    validation: z.string().optional(),
    option: new Option(
      '-t,--parse-tree-path <parseTreePath>',
      'Path to store the parsed tree',
    ),
  }),
};
