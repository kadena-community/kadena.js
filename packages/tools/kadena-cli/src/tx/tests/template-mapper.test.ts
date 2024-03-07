import { describe, expect, it, vi } from 'vitest';

import { createPactCommandFromStringTemplate } from '@kadena/client-utils/nodejs';

import { fixTemplatePactCommand } from '../commands/templates/mapper.js';
import { defaultTemplates } from '../commands/templates/templates.js';

describe('template mapper', () => {
  it('maps output of createPactCommandFromStringTemplate correctly', async () => {
    vi.useFakeTimers().setSystemTime(new Date('2023-10-26'));

    const command = await createPactCommandFromStringTemplate(
      defaultTemplates.transfer,
      {
        'account:from':
          'k:2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3',
        'account:to':
          'k:2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b4',
        'decimal:amount': '1.0',
        'chain-id': '0',
        'key:from':
          '2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3',
        'network:networkId': 'testnet04',
      },
    );

    const fixed = fixTemplatePactCommand(command);

    expect(fixed).toEqual({
      payload: {
        exec: {
          code: '(coin.transfer "k:2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3" "k:2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b4" 1.0)',
          data: {},
        },
      },
      signers: [
        {
          pubKey:
            '2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3',
          clist: [
            {
              name: 'coin.TRANSFER',
              args: [
                'k:2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3',
                'k:2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b4',
                1,
              ],
            },
            { name: 'coin.GAS', args: [] },
          ],
        },
      ],
      nonce: '',
      networkId: 'testnet04',
      meta: {
        chainId: '0',
        creationTime: 1698278400,
        gasLimit: 2300,
        gasPrice: 0.000001,
        ttl: 600,
        sender:
          'k:2619fafe33b3128f38a4e4aefe6a5559371b18b6c25ac897aff165ce14b241b3',
      },
    });
    vi.useRealTimers();
  });
});
