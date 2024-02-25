import { getPartsAndHoles } from '@kadena/client-utils/nodejs';

export function getTemplateVariables(template: string): string[] {
  try {
    const holes = getPartsAndHoles(template)[1].map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (hole: any) => hole.literal,
    );
    const unique = Array.from(new Set(holes));
    return unique;
  } catch (e) {
    return [];
  }
}
