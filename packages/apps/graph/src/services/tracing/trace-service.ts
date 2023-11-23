import fs from 'fs';

export async function logTrace(
  parentType: string,
  fieldName: string,
  duration: number,
) {
  fs.appendFileSync('traces.log', `${parentType}.${fieldName},${duration}\n`);
}
