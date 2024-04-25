import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const rule = ({ dir, pkg }) => {
  const issues = [];
  if (!pkg.scripts) {
    //
  } else {
    if (typeof pkg.scripts.lint === 'undefined' || pkg.scripts.lint === '') {
      issues.push(['warn', 'Missing "lint" script']);
    } else {
      const formatLintScript = pkg.scripts['format:lint'];
      if (!/--fix/.test(formatLintScript)) {
        issues.push(['warn', 'Missing --fix argument in "format:lint" script']);
      }
    }
    if (typeof pkg.scripts.test === 'undefined' || pkg.scripts.test === '') {
      issues.push(['warn', 'Missing "test" script']);
    }
    if (typeof pkg.scripts.build === 'undefined' || pkg.scripts.build === '') {
      issues.push(['warn', 'Missing "build" script']);
    }
    if (
      'preinstall' in pkg.scripts ||
      'install' in pkg.scripts ||
      'postinstall' in pkg.scripts
    ) {
      issues.push(['error', 'No `[pre|post]install` scripts are allowed']);
    }
    if (typeof pkg.bin !== 'undefined') {
      const binaries =
        typeof pkg.bin === 'string' ? [pkg.bin] : Object.values(pkg.bin);
      binaries.forEach((bin) => {
        const filePath = join(dir, bin);
        const contents = readFileSync(filePath, 'utf8');
        if (!contents.startsWith('#!/usr/bin/env node')) {
          issues.push([
            'error',
            `Missing or incorrect shebang in executable ${bin}`,
          ]);
        }
      });
    }
  }
  return issues;
};
export default rule;
