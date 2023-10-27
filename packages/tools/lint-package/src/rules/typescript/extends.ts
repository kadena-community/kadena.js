import type { Issues, Rule } from '../../types.js';

const tsConfigBasePath =
  './node_modules/@kadena-dev/shared-config/tsconfig-base.json';

const rule: Rule = ({ dir, file, tsConfig }) => {
  const issues: Issues = [];

  if (tsConfig.extends !== tsConfigBasePath) {
    issues.push(['warn', 'Incorrect "extends" value']);
  }

  return issues;
};

export default rule;
