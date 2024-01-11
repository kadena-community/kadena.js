import 'module-alias/register';

import { dotenv } from '@utils/dotenv';
import fs from 'fs';

export async function logTrace(
  parentType: string,
  fieldName: string,
  duration: number,
) {
  fs.appendFileSync(
    dotenv.TRACING_LOG_FILENAME,
    `${parentType}.${fieldName},${duration}\n`,
  );
}
