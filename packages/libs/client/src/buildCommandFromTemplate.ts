import debug from 'debug';

/**
 * @alpha
 */
export interface ITemplate {
  parts: TemplateParts;
  holes: TemplateHoles;
}

/**
 * @alpha
 */
export type TemplateHoles = string[];

/**
 * @alpha
 */
export type TemplateParts = string[];

/**
 * @alpha
 */
export function buildCommandFromTemplate(
  parts: string[],
  holes: string[],
  args: Record<string, string>,
): string {
  const cmd = parts
    .map((part, i) => {
      const hole = holes[i];
      if (hole === undefined) {
        return part;
      }
      return part + args[hole];
    })
    .join('');

  debug('pactjs:buildCommandFromTemplate')('cmd', cmd);

  return cmd;
}
