import { formatDocument } from './lispFormatter';

export function formatCode(code: string): string {
  try {
    return JSON.stringify(JSON.parse(code), null, 2);
  } catch (e) {
    console.error(e);
    return code;
  }
}

export function formatLisp(code: string): string {
  const formattedCode = formatDocument(code, {
    tabSize: 2,
    insertSpaces: true,
  });

  return formattedCode.slice(1);
}
