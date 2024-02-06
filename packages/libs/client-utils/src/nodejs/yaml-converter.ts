import type {
  ChainId,
  IExecutionPayloadObject,
  IPactCommand,
} from '@kadena/client';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import { join } from 'path';
import { asyncPipe } from '../core/utils/asyncPipe';

interface ITplHoleTriple {
  literal: string;
}
interface ITplHoleDouble {
  parsed: string;
}
type TplHole = ITplHoleTriple | ITplHoleDouble;
type TplPart = string;
type PartsAndHoles = [TplPart[], TplHole[]];

interface ITemplateContext {
  cwd: string;
  tplPath: string;
  tplString: PartsAndHoles;
}

type FilledYamlString = string;
interface ITemplateContextReplacedHoles extends ITemplateContext {
  filledYamlString: FilledYamlString;
}

interface IPublicMeta {
  chainId: string;
  sender: string;
  gasLimit: number;
  gasPrice: number;
  ttl: number;
}
interface ITemplateTransaction {
  codeFile?: string;
  command: string;
  meta?: IPublicMeta;
  publicMeta?: IPublicMeta;
  networkId: string;
  data: Record<string, any>;
  signers: Array<{ public: string }>;
  nonce: string;
}

interface ITemplateContextPactCommand extends ITemplateContextReplacedHoles {
  tplTx: Omit<ITemplateTransaction, 'codeFile'> & { code?: string };
}

// Responsinble for splitting a string into parts and holes
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

export const getPartsAndHolesInCtx = (
  tplPath: string,
  cwd: string = process.cwd(),
): ITemplateContext => {
  const file = readFileSync(join(cwd, tplPath), 'utf-8').toString();
  const tplString = getPartsAndHoles(file);

  return {
    tplPath,
    cwd,
    tplString,
  };
};

// Responsible for replacing holes with values
export const replaceHoles =
  (args: Record<string, string | number>) => (partsAndHoles: PartsAndHoles) => {
    const [parts, holes] = partsAndHoles;
    const allParts = zip(parts, holes);
    return allParts
      .map((partOrHole, index) => {
        if (typeof partOrHole === 'string') {
          // it's a part
          return partOrHole;
        } else {
          // Currently we are unaware of the difference between {{}} and {{{}}} so we treat them the same: as a literal hole
          if ('literal' in partOrHole) {
            // it's a literal hole
            if (!(partOrHole.literal in args)) {
              throw new Error(
                `argument to fill hole for ${
                  partOrHole.literal
                } is missing in ${allParts[index - 1]}{{${
                  partOrHole.literal
                }}}${allParts[index + 1]}}`,
              );
            }

            return args[partOrHole.literal];
          }
        }
      })
      .join('');
  };

const loadYaml = (filledYamlString: string) => {
  return yaml.load(filledYamlString) as ITemplateTransaction;
};

// Responsible for replacing holes in a context with values
export const replaceHolesInCtx = (args: Record<string, string | number>) => {
  return (ctx: ITemplateContext): ITemplateContextReplacedHoles => {
    const { tplString } = ctx;
    return { ...ctx, filledYamlString: replaceHoles(args)(tplString) };
  };
};

export const parseYamlToKdaTx =
  (args: Record<string, string | number>) =>
  (
    ctx: ITemplateContextReplacedHoles,
  ): ITemplateContextPactCommand['tplTx'] => {
    const { filledYamlString } = ctx;
    const kdaToolTx = loadYaml(filledYamlString);

    if (!('codeFile' in kdaToolTx && kdaToolTx.codeFile)) {
      return kdaToolTx;
    }

    const { codeFile, ...kdaToolTxWithoutCodeFile } = kdaToolTx;
    const codeWithHoles = readFileSync(join(ctx.cwd, codeFile), 'utf-8');

    const code = replaceHoles(args)(getPartsAndHoles(codeWithHoles));

    return {
      ...kdaToolTxWithoutCodeFile,
      code,
    };
  };

// Responsible for converting a kda tool transaction into a kadena client transaction
export const convertTemplateTxToPactCommand = (
  tplTx: ITemplateContextPactCommand['tplTx'],
): IPactCommand => {
  const { data, ...kdaToolTx } = tplTx;

  const execPayload: IExecutionPayloadObject = {
    exec: {
      data: data ? data : {},
      code: kdaToolTx.code!,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { publicMeta, meta, code, ...kdaToolTxWithoutMeta } = kdaToolTx;
  const metadata = meta || publicMeta || ({} as IPublicMeta);

  return {
    ...kdaToolTxWithoutMeta,
    payload: execPayload,
    meta: {
      ...metadata,
      chainId: metadata.chainId as ChainId,
      creationTime: Math.floor(Date.now() / 1000),
    },
    nonce: kdaToolTx.nonce ? kdaToolTx.nonce : '',
    signers: (kdaToolTx.signers ?? []).map(publicToPubkey),
    networkId: kdaToolTx.networkId,
  };
};

export const createPactCommandFromTemplate = (
  path: string,
  args: Record<string, string | number>,
  cwd?: string,
): Promise<IPactCommand> => {
  return asyncPipe(
    getPartsAndHolesInCtx,
    replaceHolesInCtx(args),
    parseYamlToKdaTx(args),
    convertTemplateTxToPactCommand,
  )(path, cwd);
};

export const createPactCommandFromStringTemplate = (
  template: string,
  args: Record<string, string | number>,
): Promise<IPactCommand> => {
  return asyncPipe(
    getPartsAndHoles,
    replaceHoles(args),
    loadYaml,
    convertTemplateTxToPactCommand,
  )(template);
};

// Responsible for zipping together parts and holes
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

// Responsible for converting a public key to a pubkey
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
