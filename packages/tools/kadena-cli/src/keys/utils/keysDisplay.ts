import type { IPlainKey } from '../../services/index.js';
import type { IWallet as IServiceWallet } from '../../services/wallet/wallet.types.js';
import { maskStringPreservingStartAndEnd } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { relativeToCwd } from '../../utils/path.util.js';
import type { TableHeader, TableRow } from '../../utils/tableDisplay.js';

export async function printPlainKeys(plainKeys: IPlainKey[]): Promise<void> {
  const header: TableHeader = ['Alias', 'Public Key', 'Secret Key'];
  const rows: TableRow[] = [];

  if (plainKeys.length === 0) {
    log.info('There are no key files in your working directory.');
    log.info('You can add one using:\n');
    log.info('  kadena key generate');
    return;
  }

  const hasLegacy = plainKeys.some((key) => key.legacy);
  if (hasLegacy) header.push('Legacy');

  for (const key of plainKeys) {
    const row = [
      key.alias,
      key.publicKey,
      maskStringPreservingStartAndEnd(key.secretKey, 35),
    ];
    if (hasLegacy) row.push(key.legacy ? 'Yes' : 'No');
    rows.push(row);
  }

  log.info(`Listing keys in the working directory:`);

  if (rows.length > 0) {
    log.output(log.generateTableString(header, rows), plainKeys);
  } else {
    log.info('No valid keys found');
  }
}

export async function printWalletKeys(
  wallet: IServiceWallet | null,
): Promise<void> {
  if (!wallet) return;

  const header: TableHeader = ['Alias', 'Index', 'Public Key'];
  const rows: TableRow[] = [];

  if (wallet.keys.length === 0) {
    log.info(`\nWallet: ${wallet.alias}${wallet.legacy ? ' (legacy)' : ''}`);
    return log.info('No keys');
  }

  for (const key of wallet.keys) {
    rows.push([
      key.alias ?? `N/A`,
      key.index.toString(),
      key.publicKey ?? 'N/A',
    ]);
  }

  if (rows.length > 0) {
    log.info(`\nWallet: ${wallet.alias}${wallet.legacy ? ' (legacy)' : ''}`);
    log.output(log.generateTableString(header, rows), wallet.keys);
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
      'The Plain Key Pair is stored within your keys folder under the filename(s):',
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

  const header: TableHeader = ['Public Key', 'Secret Key'];
  const rows: TableRow[] = keys.map((key) => [
    key.publicKey,
    maskStringPreservingStartAndEnd(key.secretKey, 35),
  ]);

  const hasLegacy = keys.some((key) => key.legacy);
  log.info(
    log.color.green(
      hasLegacy
        ? 'Generated Legacy Plain Key Pair(s):'
        : 'Generated Plain Key Pair(s):',
    ),
  );

  log.output(log.generateTableString(header, rows), keys);
  log.info('');
}
