import { input } from '@inquirer/prompts';

export async function simulateAccountAmountPromt(): Promise<string> {
  return await input({
    message: 'Enter the amount of accounts to be created in the simulation.',
    default: '6',
  });
}

export async function simulateTransferIntervalPromt(): Promise<string> {
  return await input({
    message: 'Enter the transfer interval in milliseconds.',
    default: '100',
  });
}

export async function simulateMaxAmountPromt(): Promise<string> {
  return await input({
    message: 'Enter the max transfer amount per single transaction (coin).',
    default: '25',
  });
}

export async function simulateTokenPoolPromt(): Promise<string> {
  return await input({
    message: 'Enter the total token pool (coin).',
    default: '1000000',
  });
}

export async function simulateSeedPromt(): Promise<string> {
  return await input({
    message: 'Enter the seed for the simulation.',
    default: Date.now().toString(),
  });
}
