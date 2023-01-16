import { createReadStream } from 'fs';

export async function* readLines(filePath: string): AsyncGenerator<string> {
  const fileStream = createReadStream(filePath);

  let previous = '';
  for await (const chunk of fileStream) {
    previous += chunk;
    let eolIndex;
    while ((eolIndex = previous.indexOf('\n')) >= 0) {
      const line = previous.slice(0, eolIndex);
      yield line;
      previous = previous.slice(eolIndex + 1);
    }
  }

  if (previous.length > 0) {
    yield previous;
  }
}
