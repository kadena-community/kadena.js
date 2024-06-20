export function extractImportedFiles(indexDts: string): string[] {
  return (indexDts || '')
    .split(/(\r?\n)|;/)
    .map((line) => line?.replace(/export\s*\*\s*from/, 'import'))
    .map((line) => {
      const matches = line?.match(/^\s*import\s*[\'\"]\.\/(.*)[\'\"]/);
      return matches ? matches[1] : '';
    })
    .filter(
      (fileName, idx, list) => fileName && list.indexOf(fileName) === idx,
    );
}
