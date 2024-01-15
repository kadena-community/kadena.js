import { input } from '@inquirer/prompts';

export async function simulateNoAccountsPrompt(): Promise<number> {
  const noAccounts = await input({
    message: 'Enter the amount of accounts to be created in the simulation.',
    default: '6',
    validate: (value) => {
      const valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
  });

  return parseInt(noAccounts);
}

export async function simulateTransferIntervalPrompt(): Promise<number> {
  const transferInterval = await input({
    message: 'Enter the transfer interval in milliseconds.',
    default: '100',
    validate: (value) => {
      const valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
  });

  return parseInt(transferInterval);
}

export async function simulateMaxAmountPrompt(): Promise<number> {
  const maxAmount = await input({
    message: 'Enter the max transfer amount per single transaction (coin).',
    default: '25',
    validate: (value) => {
      const valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
  });

  return parseInt(maxAmount);
}

export async function simulateTokenPoolPrompt(): Promise<number> {
  const tokenPool = await input({
    message: 'Enter the total token pool (coin).',
    default: '1000000',
    validate: (value) => {
      const valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
  });

  return parseInt(tokenPool);
}

export function simulateSeedPrompt(): Promise<string> {
  return input({
    message: 'Enter the seed for the simulation.',
    default: Date.now().toString(),
  });
}

export function simulateLogFolderPrompt(): Promise<string> {
  return input({
    message: 'Specify the directory where the log file will be generated',
    default: `${process.cwd()}/logs/simute`,
  });
}

export async function simulateMaxTimePrompt(): Promise<number> {
  const maxTime = await input({
    message: 'Specify the maximum time in miliseconds for the simulation',
    default: (86400000 * 7).toString(), // 7 days
    validate: (value) => {
      if (value === null || value === '') return true;
      const valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
  });

  return parseInt(maxTime);
}
