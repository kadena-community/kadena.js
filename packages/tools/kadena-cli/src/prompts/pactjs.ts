import { input } from '../utils/prompts.js';

export const cleanPrompt = async (): Promise<string> => {
  const response = await input({
    message: 'Would you like to clean existing generated files? (yes/no)',
    validate: (input: string) => {
      if (input.toLowerCase() === 'yes' || input.toLowerCase() === 'no') {
        return true;
      }
      return 'Please enter "yes" or "no"';
    },
  });
  return response.toLowerCase().trim();
};

export const capsInterfacePrompt = async (): Promise<string> => {
  const response = await input({
    message: 'Enter a custom name for the interface of the caps (optional):',
  });

  if (response.trim().length === 0) {
    return '';
  }

  return response;
};

export const fileOrDirectoryPrompt = async (
  previousQuestions: Record<string, unknown>,
  args: Record<string, unknown>,
  isOptional: boolean,
): Promise<string> => {
  const response = await input({
    message:
      'Enter the file(s) or directory to generate the client from, separated by commas:',
    validate: (input: string) => {
      if (input.trim().length === 0 && !isOptional) {
        return 'Please enter at least one file path or directory';
      }
      return true;
    },
  });

  if (response.trim().length === 0 && isOptional) {
    return '';
  }

  return response;
};

export const filePrompt = async (
  previousQuestions: Record<string, unknown>,
  args: Record<string, unknown>,
  isOptional: boolean,
): Promise<string> => {
  if (
    Array.isArray(previousQuestions.contract) &&
    previousQuestions.contract.length === 0
  ) {
    return '';
  }
  const response = await input({
    message:
      'Enter the file(s) to generate d.ts from, separated by commas: (optional)',
    validate: (input: string) => {
      if (input.trim().length === 0 && !isOptional) {
        return 'Please enter at least one file path';
      }
      return true;
    },
  });

  if (response.trim().length === 0 && isOptional) {
    return '';
  }

  return response;
};

export const contractPrompt = async (
  previousQuestions: Record<string, unknown>,
  args: Record<string, unknown>,
): Promise<string> => {
  if (
    Array.isArray(previousQuestions.file) &&
    previousQuestions.file.length === 0
  ) {
    return '';
  }
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

  return response;
};

export const apiPrompt = async (
  previousQuestions: Record<string, unknown>,
  args: Record<string, unknown>,
  isOptional: boolean,
): Promise<string> => {
  const response = await input({
    message: 'Enter the API to use for retrieving the contract (optional):',
    validate: (input: string) => {
      if (input.trim().length === 0 && !isOptional) {
        return 'Please enter an API';
      }
      return true;
    },
  });

  if (response.trim().length === 0 && isOptional) {
    return '';
  }

  return response;
};

export const modulePrompt = async (): Promise<string> => {
  const response = await input({
    message: 'Enter the module you want to retrieve (e.g. "coin"):',
    validate: (input: string) => {
      if (input.trim().length === 0) {
        return 'Please enter the module name';
      }
      return true;
    },
  });
  return response.trim();
};

export const outPrompt = async (): Promise<string> => {
  const response = await input({
    message: 'Enter file to write the contract to:',
    validate: (input: string) => {
      if (input.trim().length === 0) {
        return 'Please enter file to write the contract to';
      }
      return true;
    },
  });
  return response.trim();
};

export const namespacePrompt = async (): Promise<string> => {
  const response = await input({
    message: 'Enter the namespace for the contract (optional):',
  });

  if (response.trim().length === 0) {
    return '';
  }

  return response.trim();
};

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

export const networkPrompt = async (): Promise<string> => {
  return await input({
    message: 'Enter the network ID (optional):',
  });
};

export const parseTreePathPrompt = async (): Promise<string> => {
  const response = await input({
    message: 'Enter the path to store the parsed tree (optional):',
  });

  if (response.trim().length === 0) {
    return '';
  }

  return response.trim();
};
