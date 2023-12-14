import { exec } from 'child_process';

const changedFiles = [];

exec('git diff --name-only', (error, stdout, stderr) => {
  if (error) {
      console.error(`exec error: ${error}`);
      return;
  }
  const files = stdout.split('\n');
  files.forEach(file => {
    if (file.startsWith('packages/apps/docs')) {
      changedFiles.push(file);
    }
  });

  console.log(`Changed files:\n${changedFiles}`);
});
