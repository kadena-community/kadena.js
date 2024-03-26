import { defineCommand } from 'citty';

export const pactCommand = defineCommand({
  meta: {
    name: 'pact',
    description: 'Manage Pact installation',
  },
  subCommands: {
    install: async () => (await import('./install')).installCommand,
    upgrade: async () => (await import('./upgrade')).upgradeCommand,
  },
});
