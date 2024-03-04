import { getPartsAndHoles } from '@kadena/client-utils/nodejs';
import z, { ZodError } from 'zod';
import { CommandError } from '../../utils/command.util.js';
import { formatZodError, notEmpty } from '../../utils/helpers.js';

const holeSchema = z.object({
  literal: z.string().refine((x) => x.trim() === x, {
    message: 'Variable can not have whitespace around it',
  }),
});

export function getTemplateVariables(template: string): string[] {
  try {
    const holes = getPartsAndHoles(template)[1]
      .map((hole) => {
        const parsed = holeSchema.safeParse(hole);
        if (!parsed.success) throw parsed.error;
        return parsed.data.literal;
      })
      .filter(notEmpty);
    const unique = Array.from(new Set(holes));
    return unique;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new CommandError({
        errors: [
          'There was a problem parsing the ktpl template:',
          formatZodError(error),
        ],
        exitCode: 1,
      });
    }
    return [];
  }
}
