import type { IPlainKey } from '../../services/index.js';
import type { IWallet as IServiceWallet } from '../../services/wallet/wallet.types.js';
import { log } from '../../utils/logger.js';
import { relativeToCwd } from '../../utils/path.util.js';
import type { TableHeader, TableRow } from '../../utils/tableDisplay.js';

export async function printPlainKeys(plainKeys: IPlainKey[]): Promise<void> {
  const header: TableHeader = ['Filename', 'Public Key'];
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
    const row = [key.alias, key.publicKey];
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
      'The Key Pair is stored in your working directory with the filename(s):',
    ),
  );
  log.info(keyPairs.map((key) => relativeToCwd(key.filepath)).join('\n'));
  log.output(keyPairs.map((key) => relativeToCwd(key.filepath)).join('\n'));
}

/**
 * Prints the filenames of stored HD keys.
 * @param {string} alias - The alias for the keys.
 * @param {IKeyPair[]} keyPairs - Array of key pairs.
 * @param {boolean} isLegacy - Indicates if the keys are in legacy format.
 * @param {number} [startIndex=0] - The starting index for naming the key files.
 */
export function printStoredHdKeys(
  wallet: IWallet,
  alias: string,
  keyPairs: IKeyPair[],
  isLegacy: boolean,
  startIndex: number = 0,
): void {
  printStoredKeys(alias, keyPairs, isLegacy, wallet, startIndex);
}

/**
 * @param {string} alias - The alias for the keys.
 * @param {IKeyPair[]} keyPairs - Array of key pairs.
 * @param {boolean} isLegacy - Indicates if the keys are in legacy format.
 * @param {boolean} isHd - Indicates if the keys are HD (Hierarchical Deterministic) or not.
 * @param {number} [startIndex=0] - The starting index for naming the key files.
 */
export function printStoredKeys(
  alias: string,
  keyPairs: IKeyPair[],
  isLegacy: boolean,
  wallet: IWallet | null,
  startIndex: number = 0,
): void {
  const header: TableHeader = ['Filepath'];
  const rows: TableRow[] = [];

  if (wallet === null) throw new Error('Wallet is required');

  const ext = wallet
    ? isLegacy
      ? KEY_LEGACY_EXT
      : KEY_EXT
    : isLegacy
    ? PLAIN_KEY_LEGACY_EXT
    : PLAIN_KEY_EXT;

  const sanitizedAlias = sanitizeFilename(alias).toLocaleLowerCase();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  keyPairs.forEach((_, index) => {
    const fileNameIndex = keyPairs.length > 1 ? `-${startIndex + index}` : '';
    const fileName = `${sanitizedAlias}${fileNameIndex}${ext}`;
    const filePath = relativeToCwd(
      path.join(
        wallet ? path.join(WALLET_DIR, wallet.folder) : PLAIN_KEY_DIR,
        fileName,
      ),
    );
    rows.push([filePath]);
  });

  if (rows.length > 0) {
    const message =
      'The HD Key Pair is stored within your keys folder under the filename(s):';

    log.info(log.color.green(message));
    log.output(log.generateTableString(header, rows));
  } else {
    log.info('No keys found.');
  }
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

  const header: TableHeader = ['Public Key'];
  const rows: TableRow[] = keys.map((key) => [key.publicKey]);

  const hasLegacy = keys.some((key) => key.legacy);
  log.info(
    log.color.green(
      hasLegacy
        ? 'Generated Legacy Plain Key Pair(s):'
        : 'Generated Plain Key Pair(s):',
    ),
  );

  log.output(
    log.generateTableString(header, rows),
    keys.length === 1 ? keys[0] : keys,
  );
  log.info('');
}
