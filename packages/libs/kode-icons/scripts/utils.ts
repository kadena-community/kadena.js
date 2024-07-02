import type { Options } from 'prettier';
import { format, resolveConfig, resolveConfigFile } from 'prettier';

const defaultPrettierOptions: Options = {
  parser: 'typescript',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  proseWrap: 'always',
};

export async function getPrettierConfigs() {
  const prettierConfigFile = await resolveConfigFile();
  let prettierConfig = defaultPrettierOptions;
  if (prettierConfigFile !== null) {
    const resolved = await resolveConfig(prettierConfigFile);
    if (resolved) {
      prettierConfig = resolved;
    }
  }
  prettierConfig.parser = defaultPrettierOptions.parser;
  return prettierConfig;
}

export async function formatCode(content: string, prettierConfig?: Options) {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!prettierConfig) {
    prettierConfig = await getPrettierConfigs();
  }
  return format(content, prettierConfig);
}
