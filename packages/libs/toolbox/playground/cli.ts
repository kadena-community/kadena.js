import { runToolboxCommand } from '../src/cli';

runToolboxCommand()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
