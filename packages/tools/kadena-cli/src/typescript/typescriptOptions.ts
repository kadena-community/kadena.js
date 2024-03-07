import { Option } from 'commander';
import { z } from 'zod';
import { typescript } from '../prompts/index.js';
import { createOption } from '../utils/createOption.js';

export const typescriptOptions = {
  typescriptClean: createOption({
    key: 'typescriptClean' as const,
    prompt: typescript.typescriptClean,
    validation: z.boolean(),
    option: new Option('--typescript-clean', 'Clean existing generated files'),
  }),
  typescriptCapsInterface: createOption({
    key: 'typescriptCapsInterface' as const,
    prompt: typescript.typescriptCapsInterface,
    validation: z.string().optional(),
    option: new Option(
      '--typescript-caps-interface <interface>',
      'Custom name for the interface of the caps. Can be used to create a type definition with a limited set of capabilities.',
    ),
  }),
  typescriptFile: createOption({
    key: 'typescriptFile' as const,
    prompt: typescript.typescriptFile,
    validation: z.string().optional(),
    option: new Option(
      '--typescript-file <file>',
      'Generate d.ts from Pact contract file(s) (comma separated)',
    ),
    expand: async (file: string) => {
      return file
        .split(',')
        .map((value) => value.trim())
        .filter((f) => f.length);
    },
  }),
  typescriptContract: createOption({
    key: 'typescriptContract' as const,
    prompt: typescript.typescriptContract,
    validation: z.string().optional(),
    option: new Option(
      '--typescript-contract <contractName>',
      'Generate d.ts from Pact contract(s) from the blockchain (comma separated)',
    ),
    expand: async (contracts: string) => {
      return contracts
        .split(',')
        .map((value) => value.trim())
        .filter((c) => c.length);
    },
  }),
  typescriptNamespace: createOption({
    key: 'typescriptNamespace' as const,
    prompt: typescript.typescriptNamespace,
    validation: z.string().optional(),
    option: new Option(
      '--typescript-namespace <string>',
      'use as the namespace of the contract if its not clear in the contract',
    ),
  }),
};
