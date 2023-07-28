import { spawn } from 'child_process';

const stderrFilter = [
  '[DEP_WEBPACK_MODULE_UPDATE_HASH] DeprecationWarning',
  'node --trace-deprecation',
];

function muteStderrWarning(stderr) {
  return stderr
    .toString()
    .split('\n')
    .filter((line) => !stderrFilter.find((warning) => line.includes(warning)))
    .join('\n');
}

const build = spawn('node_modules/.bin/next', ['build']);

build.stdout.on('data', (data) => {
  process.stdout.write(data);
});

build.stderr.on('data', (data) => {
  process.stderr.write(muteStderrWarning(data));
});
