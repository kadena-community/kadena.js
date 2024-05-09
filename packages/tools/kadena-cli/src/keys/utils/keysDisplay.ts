import type { IPlainKey } from '../../services/index.js';
import type { IWallet as IServiceWallet } from '../../services/wallet/wallet.types.js';
import { log } from '../../utils/logger.js';
import { relativeToCwd } from '../../utils/path.util.js';
import { TABLE_DEFAULT, createTable } from '../../utils/table.js';

export async function printPlainKeys(plainKeys: IPlainKey[]): Promise<void> {
  const hasLegacy = plainKeys.some((key) => key.legacy);
  const table = createTable({
    head: hasLegacy
      ? ['Filename', 'Public Key', 'Legacy']
      : ['Filename', 'Public Key'],
  });

  if (plainKeys.length === 0) {
    log.info('There are no key files in your working directory.');
    log.info('You can add one using:\n');
    log.info('  kadena key generate');
    return;
  }
  for (const key of plainKeys) {
    const row = [key.alias, key.publicKey];
    if (hasLegacy) row.push(key.legacy ? 'Yes' : 'No');
    table.push(row);
  }

  log.info(`Listing keys in the working directory:`);

  if (table.length > 0) {
    log.output(table.toString(), plainKeys);
  } else {
    log.info('No valid keys found');
  }
}

export async function printWalletKeys(
  wallet: IServiceWallet | null,
): Promise<void> {
  if (!wallet) return;

  const table = createTable({
    ...TABLE_DEFAULT,
    head: ['Alias', 'Index', 'Public key'],
  });

  if (wallet.keys.length === 0) {
    log.info(`\nWallet: ${wallet.alias}${wallet.legacy ? ' (legacy)' : ''}`);
    return log.info('No keys');
  }

  for (const key of wallet.keys) {
    table.push([
      key.alias ?? `N/A`,
      key.index.toString(),
      key.publicKey ?? 'N/A',
    ]);
  }

  if (table.length > 0) {
    log.info(`\nWallet: ${wallet.alias}${wallet.legacy ? ' (legacy)' : ''}`);
    log.info(table.toString());
  } else {
    log.info(`\nWallet: ${wallet.alias}${wallet.legacy ? ' (legacy)' : ''}`);
    log.info('No valid keys found');
  }
}

/**
 * Prints the filenames of stored plain keys.
 * @param {IKeyPair[]} keyPairs - Array of plain key pairs
 */
export function printStoredPlainKeys(keyPairs: IPlainKey[]): void {
  if (keyPairs.length === 0) return;
  log.info(
    log.color.green(
      'The Key Pair is stored in your working directory with the filename(s):',
    ),
  );
  log.info(keyPairs.map((key) => relativeToCwd(key.filepath)).join('\n'));
}

/**
 * Displays generated plain key pairs in a formatted manner.
 * @param {IPlainKey[]} keys - Array of plain key pairs.
 * @param {boolean} [legacy] - Optional flag to indicate if the keys are legacy keys.
 */
export function displayGeneratedPlainKeys(keys: IPlainKey[]): void {
  if (keys.length === 0) {
    log.info('Did not generate any keys.');
    return;
  }

  const hasLegacy = keys.some((key) => key.legacy);
  log.info(
    log.color.green(
      hasLegacy
        ? 'Generated Legacy Plain Key Pair(s):'
        : 'Generated Plain Key Pair(s):',
    ),
  );

  log.info(log.color.green('Public key'));
  log.output(
    keys.map((key) => key.publicKey).join('\n'),
    keys.length === 1 ? keys[0] : keys,
  );
  log.info('');
}
