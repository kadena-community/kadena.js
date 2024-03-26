import { defineCommand } from 'citty';
import { upgradePact } from '../../../installer';

export const upgradeCommand = defineCommand({
  meta: {
    name: 'upgrade',
    description: 'Upgrade Pact',
  },
  run: upgradePact,
});
