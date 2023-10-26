export function formatCode(code: string): string {
  try {
    return JSON.stringify(JSON.parse(code), null, 2);
  } catch (e) {
    console.error(e);
    return code;
  }
}
