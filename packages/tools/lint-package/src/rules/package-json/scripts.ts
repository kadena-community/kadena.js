import type { Issues, Rule } from '../../types.js';

const rule: Rule = ({ pkg }) => {
  const issues: Issues = [];

  if (!pkg.scripts) {
    //
  } else {
    if (typeof pkg.scripts.lint === 'undefined' || pkg.scripts.lint === '') {
      issues.push(['warn', 'Missing "lint" script']);
    } else {
      const lintScript = pkg.scripts['lint:src'] ?? pkg.scripts.lint;
      if (!/--fix/.test(lintScript)) {
        issues.push(['warn', 'Missing --fix argument in "lint" script']);
      }
    }

    if (typeof pkg.scripts.test === 'undefined' || pkg.scripts.test === '') {
      issues.push(['warn', 'Missing "test" script']);
    }

    if (typeof pkg.scripts.build === 'undefined' || pkg.scripts.build === '') {
      issues.push(['warn', 'Missing "build" script']);
    }
  }

  return issues;
};

export default rule;
