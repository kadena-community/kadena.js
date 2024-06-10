import { input } from '../utils/prompts.js';

export const cleanPrompt = async (): Promise<boolean> => {
  const response = await input({
    message: 'Would you like to clean existing generated files? (yes/no)',
    validate: (input: string) => {
      if (input.toLowerCase() === 'yes' || input.toLowerCase() === 'no') {
        return true;
      }
      return 'Please enter "yes" or "no"';
    },
  });
  return response.toLowerCase() === 'yes';
};

export const capsInterfacePrompt = async (): Promise<string> => {
  return await input({
    message: 'Enter a custom name for the interface of the caps (optional):',
  });
};
/* -- backWCompat -- */
export const filePrompt = async (): Promise<string[]> => {
  const response = await input({
    message: 'Enter the file(s) to generate d.ts from, separated by commas:',
    validate: (input: string) => {
      if (input.trim().length === 0) {
        return 'Please enter at least one file path';
      }
      return true;
    },
  });
  return response.split(',').map((file: string) => file.trim());
};

export const contractPrompt = async (): Promise<string[]> => {
  const response = await input({
    message:
      'Enter the contract(s) to generate d.ts from the blockchain, separated by commas:',
    validate: (input: string) => {
      if (input.trim().length === 0) {
        return 'Please enter at least one contract name';
      }
      return true;
    },
  });
  return response.split(',').map((contract: string) => contract.trim());
};

export const namespacePrompt = async (): Promise<string> => {
  return await input({
    message: 'Enter the namespace for the contract (optional):',
  });
};

/* -- backWCompat -- */
export const apiPrompt = async (): Promise<string> => {
  return await input({
    message: 'Enter the API to use for retrieving the contract (optional):',
  });
};

/* -- backWCompat -- */
export const chainPrompt = async (): Promise<number> => {
  const response = await input({
    message: 'Enter the chain ID (optional):',
    validate: (input: string) => {
      const parsed = parseInt(input, 10);
      if (isNaN(parsed)) {
        return 'Please enter a valid number';
      }
      return true;
    },
  });
  return parseInt(response, 10);
};

/* -- backWCompat -- */
export const networkPrompt = async (): Promise<string> => {
  return await input({
    message: 'Enter the network ID (optional):',
  });
};

export const parseTreePathPrompt = async (): Promise<string> => {
  return await input({
    message: 'Enter the path to store the parsed tree (optional):',
  });
};
