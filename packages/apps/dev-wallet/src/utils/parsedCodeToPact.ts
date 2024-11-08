import { PactNumber } from '@kadena/pactjs';
import { execCodeParser, IParsedCode } from '@kadena/pactjs-generator';
import { shorten as textShorten } from './helpers';

const shorten = (str: string, length: number): string => {
  if (str.length <= 2 * length + 5) {
    return str;
  }
  return textShorten(str, length);
};

const parseArg = (arg: IParsedCode['args'][number], shortening = 6): string => {
  if ('string' in arg) {
    return `"${shorten(arg.string, shortening)}"`;
  }
  if ('int' in arg) {
    return `${arg.int}`;
  }
  if ('decimal' in arg) {
    return new PactNumber(arg.decimal).toDecimal();
  }
  if ('list' in arg) {
    return `[${arg.list.map((a) => parseArg(a, shortening)).join(', ')}]`;
  }
  if ('object' in arg) {
    return `{${arg.object
      .map((a) => `${a.property}: ${parseArg(a.value, shortening)}`)
      .join(', ')}}`;
  }
  if ('code' in arg) {
    return parsedCodeToPact(arg.code, shortening);
  }
  return JSON.stringify(arg);
};

function parsedCodeToPact(code: IParsedCode, shortening = 6): string {
  const namespace = code.function.namespace
    ? shorten(code.function.namespace, shortening)
    : '';
  const name = code.function.name;
  const module = code.function.module;
  const fn = [namespace, module, name].filter(Boolean).join('.');
  const shortenCode = `(${fn} ${code.args
    .map((arg) => parseArg(arg, shortening))
    .join(' ')})`;
  return shortenCode;
}

export function shortenPactCode(code: string, shortening = 6): string {
  const parsedCode = execCodeParser(code);
  const codes =
    parsedCode?.map((code) => {
      return parsedCodeToPact(code, shortening);
    }) ?? [];
  return codes.join('\n');
}
