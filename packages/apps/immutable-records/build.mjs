import { spawn } from 'child_process';

/*
 * NextJS build outputs a depredaction warning related to
 * usage of @kadena/react-ui/theme. It originated from webpack5
 * with the mini-css-extract-plugin.
 *
 * We have investiated the issue and even when upgrading packages
 * to the latest versions the warning remains.
 *
 * This file is a workaround to mute the warning until newer versions
 * are available that fix the issue.
 */

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
