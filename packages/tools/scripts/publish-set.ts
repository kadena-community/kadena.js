import chalk from 'chalk';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prompt } from 'enquirer';
import { error, prefix, success } from '@changesets/logger';
import { symbols } from 'ansi-colors';
import { writeFile } from 'node:fs/promises';

// Prepare Changesets config to only release a subset of packages
// Usage: `npx tsx packages/tools/changesets/publish-set.ts`

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseDir = join(__dirname, '../../..');
const CHANGESETS_CONFIG = join(baseDir, '.changeset/config.json');
const WORKSPACE_CONFIG = join(baseDir, 'packages.json');

const { green, yellow, red, bold, blue, cyan } = chalk;

// those types are not exported from `enquirer` so we extract them here
// so we can make type assertions using them because `enquirer` types do no support `prefix` right now
type PromptOptions = Extract<Parameters<typeof prompt>[0], { type: string }>;
type ArrayPromptOptions = Extract<
  PromptOptions,
  {
    type:
      | 'autocomplete'
      | 'editable'
      | 'form'
      | 'multiselect'
      | 'select'
      | 'survey'
      | 'list'
      | 'scale';
  }
>;

function formatPkgNameAndVersion(pkgName: string, version: string) {
  return `${bold(pkgName)}@${bold(version)}`;
}

type Workspace = Array<{
  name: string;
  version: string;
  private: boolean;
  path: string;
}>;

const serialId: () => number = (function () {
  let id = 0;
  return () => id++;
})();

const termSize = () => ({ rows: 25 });

let cancelFlow = () => {
  success('Cancelled... 👋 ');
  process.exit();
};

const limit = Math.max(termSize().rows - 5, 10);

async function askCheckboxPlus(
  message: string,
  choices: Array<any>,
  format?: (arg: any) => any,
): Promise<Array<string>> {
  const name = `CheckboxPlus-${serialId()}`;

  return prompt({
    type: 'autocomplete',
    name,
    message,
    prefix,
    multiple: true,
    choices,
    format,
    limit,
    onCancel: cancelFlow,
    symbols: {
      indicator: symbols.radioOff,
      checked: symbols.radioOn,
    },
    indicator(state: any, choice: any) {
      return choice.enabled ? state.symbols.checked : state.symbols.indicator;
    },
  } as ArrayPromptOptions)
    .then((responses: any) => responses[name])
    .catch((err: unknown) => {
      error(err);
    });
}

const main = async () => {
  const changesetsConfig = (await import(CHANGESETS_CONFIG)).default;
  const workspace = (await import(WORKSPACE_CONFIG)).default as Workspace;
  const publishablePackages = workspace.filter((pkg) => pkg.private !== true);
  const fixedPackages = changesetsConfig.fixed.flat();
  const packageNames = publishablePackages?.map((pkg) => pkg.name) ?? [];
  const sortedPackages = publishablePackages.sort((a, b) => {
    const aIsFixed = fixedPackages.includes(a.name);
    const bIsFixed = fixedPackages.includes(b.name);
    if (aIsFixed && !bIsFixed) return -1;
    if (!aIsFixed && bIsFixed) return 1;
    return a.name.localeCompare(b.name);
  });

  const pkgsThatShouldBePublished = (
    await askCheckboxPlus(
      bold(`Which packages do you want to publish?`),
      [
        {
          name: 'all packages',
          choices: sortedPackages.map((pkg) => {
            return {
              name: pkg.name,
              message: formatPkgNameAndVersion(pkg.name, pkg.version),
            };
          }),
        },
      ],
      (answers) => {
        if (Array.isArray(answers)) {
          return answers
            .filter((x) => x !== 'all packages')
            .map((x) => cyan(x))
            .join(', ');
        }
        return answers;
      },
    )
  ).filter((answer) => answer !== 'all packages');

  const ignored = changesetsConfig.ignore;
  const additionalIgnored = packageNames.filter(
    (name) => !pkgsThatShouldBePublished.includes(name),
  );

  changesetsConfig.ignore = [...ignored, ...additionalIgnored];

  await writeFile(
    CHANGESETS_CONFIG,
    JSON.stringify(changesetsConfig, undefined, 2),
  );
};

main();
