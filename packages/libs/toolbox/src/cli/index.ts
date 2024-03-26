import { defineCommand, runMain } from 'citty';

const toolboxCommand = defineCommand({
  meta: {
    name: 'kadena toolbox',
    description: 'Kadena toolbox',
  },
  subCommands: {
    doctor: async () => (await import('./commands/doctor')).doctorCommand,
    init: async () => (await import('./commands/init')).initCommand,
    pact: async () => (await import('./commands/pact')).pactCommand,
    start: async () => (await import('./commands/start')).startCommand,
    prelude: async () => (await import('./commands/prelude')).preludeCommand,
    run: async () => (await import('./commands/run')).runCommand,
    test: async () => (await import('./commands/test')).testCommand,
  },
});

export async function runToolboxCommand() {
  await runMain(toolboxCommand, {
    rawArgs: process.argv.slice(3),
  });
}
