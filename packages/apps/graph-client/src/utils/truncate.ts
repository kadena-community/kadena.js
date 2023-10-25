export function truncate(
  text: string | null | undefined,
): string | null | undefined {
  if (text !== undefined && text !== null && text.length > 12) {
    return `${text.replace(/(\w{4}).*(\w{4})/, '$1****$2')}`;
  }

  return text;
}
