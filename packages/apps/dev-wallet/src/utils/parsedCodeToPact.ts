import { PactNumber } from '@kadena/pactjs';
import { execCodeParser, IParsedCode } from '@kadena/pactjs-generator';
import { shorten as textShorten } from './helpers';

const shorten = (str: string, length: number): string => {
  if (str.length <= 2 * length + 5) {
    return str;
  }
  return textShorten(str, length);
};

interface IDecoration {
  shortening?: number;
  withIndent?: number;
  breakLines?: boolean;
}

const parseArg = (
  arg: IParsedCode['args'][number],
  decoration: Required<IDecoration>,
): string => {
  if ('string' in arg) {
    return `"${shorten(arg.string, decoration.shortening)}"`;
  }
  if ('int' in arg) {
    return `${arg.int}`;
  }
  if ('decimal' in arg) {
    return new PactNumber(arg.decimal).toDecimal();
  }
  if ('list' in arg) {
    return `[${arg.list.map((a) => parseArg(a, decoration)).join(', ')}]`;
  }
  if ('object' in arg) {
    return `{${arg.object
      .map((a) => `${a.property}: ${parseArg(a.value, decoration)}`)
      .join(', ')}}`;
  }
  if ('code' in arg) {
    return parsedCodeToPact(arg.code, decoration);
  }
  return JSON.stringify(arg);
};

const indent = (str: string, spaces = 2): string => {
  return str
    .split('\n')
    .map((line) => ' '.repeat(spaces) + line)
    .join('\n');
};

function parsedCodeToPact(
  code: IParsedCode,
  { shortening = 6, withIndent = 2, breakLines = true }: IDecoration = {},
): string {
  const decoration = { shortening, withIndent, breakLines };
  const namespace = code.function.namespace
    ? shorten(code.function.namespace, shortening)
    : '';
  const name = code.function.name;
  const module = code.function.module;
  const fn = [namespace, module, name].filter(Boolean).join('.');
  const useBreakLine = breakLines && code.args?.length > 1;
  const lineChar = useBreakLine ? '\n' : ' ';

  if (!code.args) return `(${fn})`;
  const shortenCode = `(${fn}${lineChar}${code.args
    .map((arg) =>
      useBreakLine
        ? indent(parseArg(arg, decoration), withIndent)
        : parseArg(arg, decoration),
    )
    .join(lineChar)}${lineChar})`;
  return shortenCode;
}

export function shortenPactCode(
  code: string,
  decoration?: IDecoration,
): string {
  const parsedCode = execCodeParser(code);
  const codes =
    parsedCode?.map((code) => {
      return parsedCodeToPact(code, decoration);
    }) ?? [];
  return codes.join('\n');
}
