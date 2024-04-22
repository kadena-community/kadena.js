// ESLint configs can only be loaded by ESLint itself because of this line:
// require('@rushstack/eslint-config/patch/modern-module-resolution');
// So we can only load it as a string. Not worth it to strip this line and eval the rest.
const extendMatch = /extends:\s+\[\s*'@kadena-dev\/eslint-config\/profile\//;
const rule = ({ eslintConfig }) => {
  const issues = [];
  if (!extendMatch.test(eslintConfig)) {
    issues.push(['warn', 'Config extends from incorrect config']);
  }
  return issues;
};
export default rule;
