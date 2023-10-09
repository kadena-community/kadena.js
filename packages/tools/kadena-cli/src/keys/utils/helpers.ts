/**
 * Extract placeholders enclosed in {{{ }}} from a given template.
 * @param {string} template - The template containing placeholders.
 * @returns {string[]} An array of extracted placeholders.
 */
export function extractPlaceholders(template: string): string[] {
  const regex = /\{\{\{([^}]+)\}\}\}/g;
  let match;
  const placeholders = new Set<string>();

  while ((match = regex.exec(template)) !== null) {
    placeholders.add(match[1]);
  }

  return [...placeholders];
}
