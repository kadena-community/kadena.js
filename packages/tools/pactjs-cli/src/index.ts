import { program } from 'commander';

program
  .command('hello')
  .argument('name')
  .action(function (name: string) {
    console.log('hello', name);
  });

program.parse();
