import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { services } from '../../../services/index.js';
import {
  mockPrompts,
  runCommand,
  runCommandJson,
} from '../../../utils/test.util.js';
import { ensureNetworksConfiguration } from '../../networks/utils/networkHelpers.js';

const mnemonicPhrase =
  'impose athlete web basic toast enjoy object payment silly oak sugar wreck';
const password = '123123123';
const root = path.join(__dirname, '../../../');
const kadenaDir = path.join(root, '.kadena');
const txFile = path.join(root, 'transaction.json');

describe('template to legacy live test', () => {
  // skipped because usage of live chainweb-api (only used for manual testing)
  it.skip(
    'successful transaction using cli interface',
    async () => {
      await services.filesystem.ensureDirectoryExists(root);
      await ensureNetworksConfiguration(kadenaDir);
      mockPrompts({
        input: {
          'Enter your 12-word mnemonic phrase': mnemonicPhrase,
          'Enter your wallet name': 'test',
        },
        password: {
          'Enter the new wallet password': password,
          'Re-enter the password': password,
        },
      });
      const { wallet } = await runCommandJson('wallet import --legacy');

      const { stderr: accountoutput } = await runCommand(
        `account add-from-wallet -w test -l test -f coin -n testnet -c 0 -k ${wallet.keys[0].publicKey} -p keys-all --quiet`,
      );
      expect(
        accountoutput.includes(
          'The account configuration "test" has been saved in',
        ),
      );

      mockPrompts({
        input: {
          'File path of data to use': '',
          'Template value decimal:amount': '0.00001',
          'Template value chain-id': '0',
          'Where do you want to save the output': txFile,
        },
        select: {
          'Select account alias for template value account:from':
            'k:b40d6db24cfe33e435d8c5a5b56966dcb52ff9edf458b415893b54c03962e8cb',
          'Select account alias for template value account:to':
            'k:3f13aa07c9682fd78e0cf9d766ed5f5563b984a9a33f94e288c8a3ee4f454916',
          'Template key "key:from" matches account "account:from"':
            'b40d6db24cfe33e435d8c5a5b56966dcb52ff9edf458b415893b54c03962e8cb',
          'Select network id for template value networkId': 'testnet',
        },
      });

      await runCommandJson('tx add -t transfer.ktpl');

      mockPrompts({
        select: {
          'Select an action': 'wallet',
          '1 wallets found containing the keys for signing this transaction':
            'test',
        },
        checkbox: {
          'Select a transaction file': [0],
        },
        password: {
          'Enter the wallet password': password,
        },
      });

      const signed = await runCommandJson('tx sign');
      expect(signed?.[0]?.filePath).toBeTruthy();

      mockPrompts({
        input: {
          'Enter ChainId': '0',
        },
        select: {
          'Select a network': 'testnet',
        },
        checkbox: {
          'Select a transaction file': [0],
        },
      });

      const result = await runCommandJson('tx test');
      expect(result.status).toBe('success');
    },
    { timeout: 30000 },
  );
});
