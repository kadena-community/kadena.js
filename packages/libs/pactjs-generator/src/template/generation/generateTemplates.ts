import type { ITemplate } from '../parsing/parseTemplate';

function uniq(acc: string[], curr: string): string[] {
  if (acc.includes(curr)) {
    return acc;
  }
  acc.push(curr);
  return acc;
}

const commaBetweenQuotesRegex: RegExp = /","/g;
const closingBracketAtEndOfStringRegex: RegExp = /]$/;

function fixArrayFormatting(arrAsString: string): string {
  return arrAsString
    .replace('[', `[\n      `)
    .replace(commaBetweenQuotesRegex, `",\n      "`)
    .replace(closingBracketAtEndOfStringRegex, '\n    ]');
}

/**
 * @alpha
 */
export function generateTemplates(
  templates: { name: string; template: ITemplate }[],
  version: string,
): string {
  return (
    `// generated by pactjs-generator and pactjs-cli@${version}
import { buildUnsignedTransaction, ICommandBuilder } from '@kadena/client';
` +
    // Rationale: export default because we cannot export "some-template", and
    // we don't want to modify the accessors (e.g. convert to camelCase)
    `
export default {${templates
      .map(
        (t) => `
  "${t.name}": (args: {${t.template.holes
    .reduce(uniq, [] as string[])
    .map(
      (h) => `
    "${h}": string,`,
    )
    .join('')}
  }): ICommandBuilder<{}> => {
    const parts = ${fixArrayFormatting(JSON.stringify(t.template.parts))};
    const holes = ${fixArrayFormatting(JSON.stringify(t.template.holes))};

    return buildUnsignedTransaction(parts, holes, args);
  }`,
      )
      .join(',\n  ')}
}`
  );
}