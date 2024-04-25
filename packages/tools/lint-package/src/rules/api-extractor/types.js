import { accessSync, constants } from 'fs';
import { join } from 'path';
const rule = ({ dir, file, pkg }) => {
  const issues = [];
  const filePath = join(dir, file);
  try {
    accessSync(filePath, constants.F_OK);
    const name = pkg.name?.replace(/.+\//, '');
    const types = `dist/${name}.d.ts`;
    if (pkg.types === undefined || pkg.types === '' || pkg.types !== types) {
      issues.push([
        'error',
        `API Extractor is enabled, "types" in package.json should be "${types}"`,
      ]);
    }
  } catch (error) {
    // Silently failing here, since packages may not use API Extractor
    // console.warn('Missing config/api-extractor.json');
  }
  return issues;
};
export default rule;
