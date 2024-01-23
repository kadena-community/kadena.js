import { getPartsAndHoles } from '@kadena/client-utils/nodejs';

export function getTemplateVariables(template: string): string[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getPartsAndHoles(template)[1].map((hole: any) => hole.literal);
  } catch (e) {
    return [];
  }
}
