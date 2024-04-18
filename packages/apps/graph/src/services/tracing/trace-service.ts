import { dotenv } from '@utils/dotenv';
import fs from 'fs';

export async function logTrace(
  parentType: string,
  fieldName: string,
  duration: number,
): Promise<void> {
  return fs.promises.appendFile(
    dotenv.TRACING_LOG_FILENAME,
    `${parentType}.${fieldName},${duration}\n`,
  );
}
