import { writeFileSync } from 'fs';
import { join } from 'path';

export const writeModulesJson = (content: string): void => {
  if (process.env.DEBUG === 'dev') {
    writeFileSync(join(process.cwd(), 'modules.json'), content);
  }
};
