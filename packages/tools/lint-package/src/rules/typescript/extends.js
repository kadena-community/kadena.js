const tsConfigBasePath =
  './node_modules/@kadena-dev/heft-rig/tsconfig-base.json';
const rule = ({ dir, file, tsConfig }) => {
  const issues = [];
  if (tsConfig.extends !== tsConfigBasePath) {
    issues.push(['warn', 'Incorrect "extends" value']);
  }
  return issues;
};
export default rule;
