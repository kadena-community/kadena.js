import { readLines } from './readLines';

export async function processLines(
  processLine: (line: string) => Promise<void>,
  filePath: string,
): Promise<void> {
  let line;
  const reader = readLines(filePath);
  while ((line = await reader.next()).done === false) {
    await processLine(line.value);
  }
}
