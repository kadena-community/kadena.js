import { ChainId, IExecutionPayloadObject, IPactCommand } from '@kadena/client';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import { join } from 'path';

interface IParseContext {
  cwd: string;
  tplPath: string;
  tplString: PartsAndHoles;
}

interface IParseContextStepTwo extends IParseContext {
  filledYamlString: FilledYamlString;
}
interface IParseContextStepThree extends IParseContextStepTwo {
  tplTx: Omit<IKdaToolTransaction, 'codeFile'> & { code?: string };
}

interface IKdaToolTransaction {
  codeFile?: string;
  command: string;
  meta: {
    chainId: string;
    sender: string;
    gasLimit: number;
    gasPrice: number;
    ttl: number;
  };
  networkId: string;
  data: Record<string, any>;
  signers: Array<{ public: string }>;
  nonce: string;
}

/*
 * Hello {{name}}! Where is {{{name}}}{{name}}?
 *                          ^^^^^^^^^^ literalHole
 *       ^^^^^^^^ parsedHole
 * ^^^^^ part
 * - PartsAndHoles: ["Hello {{name}}! Where is ", { literal: "name" }, "{{name}}?"]
 * - PartsAndHoles: ["Hello ", { parsed: "name" }, "! ", "Where is {", { literal: "name" }, "?"]
 */
type TplHoleTriple = {
  literal: string;
};
type TplHoleDouble = {
  parsed: string;
};
type TplHole = TplHoleTriple | TplHoleDouble;
type TplPart = string;
type PartsAndHoles = [TplPart[], TplHole[]];
type GetPartsAndHoles = (path: string, cwd?: string) => IParseContext;

export const getPartsAndHoles = (text: string) => {
  return text.split(/{{(.*?)}}}?/g).reduce(
    (acc, curr, i) => {
      // if i is even, then it's a part
      // if i is odd, then it's a hole
      if (i % 2 === 0) {
        acc[0].push(curr);
      } else {
        if (curr.startsWith('{')) {
          acc[1].push({ literal: curr.slice(1) });
          return acc;
        }
        acc[1].push({ literal: curr });
      }
      return acc;
    },
    [[], []] as PartsAndHoles,
  );
};

export const getPartsAndHolesInCtx: GetPartsAndHoles = (
  path,
  cwd = process.cwd(),
) => {
  const file = readFileSync(join(cwd, path), 'utf-8').toString();
  return {
    tplPath: path,
    cwd: cwd,
    tplString: getPartsAndHoles(file),
  };
};

type FilledYamlString = string;
type ReplaceHoles = (
  ctx: IParseContext,
  holes: Record<string, string | number>,
) => IParseContextStepTwo;

export const replaceHoles = (
  partsAndHoles: PartsAndHoles,
  args: Record<string, string | number>,
) => {
  const [parts, holes] = partsAndHoles;
  const allParts = zip(parts, holes);
  return allParts
    .map((partOrHole) => {
      if (typeof partOrHole === 'string') {
        // it's a part
        return partOrHole;
      }
      if ('literal' in partOrHole) {
        // it's a literal hole
        return args[partOrHole.literal];
      } else {
        // it's a parsed hole
        const arg = args[partOrHole.parsed];
        if (typeof arg === 'string') {
          return `"${arg}"`;
        }
        if (typeof arg === 'number') {
          return `{ "decimal": "${arg}" }`;
        }
      }
    })
    .join('');
};

export const replaceHolesInCtx: ReplaceHoles = (ctx, args) => {
  const { tplString } = ctx;

  return { ...ctx, filledYamlString: replaceHoles(tplString, args) };
};

type ParseYamlKdaTx = (
  ctx: IParseContextStepTwo,
  args: Record<string, string | number>,
) => IParseContextStepThree;

export const parseYamlKdaTx: ParseYamlKdaTx = (ctx, args) => {
  const { filledYamlString } = ctx;
  const kdaToolTx = yaml.load(filledYamlString) as IKdaToolTransaction;

  if (!('codeFile' in kdaToolTx && kdaToolTx.codeFile)) {
    return {
      ...ctx,
      tplTx: kdaToolTx,
    };
  }

  const codeFile = kdaToolTx.codeFile;
  const codeWithHoles = readFileSync(
    join(ctx.cwd, codeFile),
    'utf-8',
  ).toString();

  const code = replaceHoles(getPartsAndHoles(codeWithHoles), args);
  return {
    ...ctx,
    tplTx: {
      ...kdaToolTx,
      code,
    },
  };
};

type ConvertKdaToolToKadenaClientTx = (
  kdaToolTx: IParseContextStepThree['tplTx'],
) => IPactCommand;

export const convertToKadenaClientTransaction: ConvertKdaToolToKadenaClientTx =
  (kdaToolTx) => {
    const execPayload: IExecutionPayloadObject = {
      data: kdaToolTx.data,
      code: kdaToolTx.code,
    } as unknown as IExecutionPayloadObject;
    return {
      ...kdaToolTx,
      payload: execPayload,
      meta: {
        ...kdaToolTx.meta,
        chainId: kdaToolTx.meta.chainId as ChainId,
      },
      nonce: kdaToolTx.nonce,
      signers: kdaToolTx.signers.map(publicToPubkey),
      networkId: kdaToolTx.networkId,
    };
  };

function zip(parts: string[], holes: TplHole[]) {
  const result = [];
  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i]);
    if (i < holes.length) {
      result.push(holes[i]);
    }
  }
  return result;
}
function publicToPubkey(value: { public: string }): {
  pubKey: string;
} {
  const pubKey = value.public;
  delete (value as any).public;
  return {
    ...value,
    pubKey,
  };
}
