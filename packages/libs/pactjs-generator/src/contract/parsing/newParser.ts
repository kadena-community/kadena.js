import { lexer } from './lexer';

import { Lexer, Token } from 'moo';

interface IParamType {
  kind: 'object' | 'table' | 'list';
  value: string | string[];
}

interface IFunction {
  name: string;
  returnType: string | IParamType;
  doc: string;
  parameters: {} | Record<'string', 'string'>;
  functionCalls: string[];
  requiredCapabilities: string[];
  withCapabilities: string[];
  body?: Token[];
}

interface ICapability {
  name: string;
  returnType: string | IParamType;
  doc: string;
  parameters: {} | Record<'string', string | IParamType>;
  composedCapabilities: string[];
  managed: boolean;
  managedParameters: Array<{ manager: string; parameter: string }>;
}

interface IModule {
  name: string;
  governance: string;
  doc: string;
  interfaces: string[];
  usedModules: string[];
  functions: IFunction[];
  capabilities: ICapability[];
}

interface IASTree {
  namespace: string[];
  modules: IModule[];
}

const nextToken = () => {
  const tokensToSkip = ['model', 'comment', 'ws', 'nl'];
  let token: Token | undefined = undefined;
  while ((token = lexer.next()) && tokensToSkip.includes(token.type || ''));
  return token;
};

const next = () => {
  const token = nextToken();
  if (!token) throw new Error('Token should not be undefined in this step');
  return token;
};

const blockCheck = (initialCounter = 1, blockTokens = ['lparen', 'rparen']) => {
  let blockCounter: number = initialCounter;
  const [start, end] = blockTokens;
  function inTheSameBlock(tokenType: string | undefined) {
    if (tokenType === start) {
      blockCounter += 1;
    }
    if (tokenType === end) {
      blockCounter -= 1;
    }
    return blockCounter > 0;
  }
  function skipTheBlock() {
    let token: Token | undefined = undefined;
    const skippedTokens = [];
    // skip the tokens if they are in the block
    while ((token = nextToken()) && inTheSameBlock(token.type)) {
      skippedTokens.push(token);
    }
    blockCounter = 0;
    return skippedTokens;
  }
  return { inTheSameBlock, skipTheBlock };
};

function parseParameters() {
  const { inTheSameBlock } = blockCheck();
  const params: any = {};
  let current = '';
  let token: Token | undefined = undefined;
  while ((token = nextToken()) && inTheSameBlock(token.type)) {
    if (token.type === 'colon') {
      const tok = next();
      const [kind, value] = praseType(tok);
      params[current] = kind === 'primary' ? value : { kind, value };
    } else {
      current = token.value as string;
      params[current] = '';
    }
  }
  return params;
}

function praseType(token: Token) {
  switch (token.value) {
    case 'object':
    case 'table': {
      const kind = token.value;
      const type = blockCheck(0, ['lcurly', 'rcurly'])
        .skipTheBlock()
        .filter((tok) => tok.type !== 'lcurly' && tok.type !== 'rcurly')
        .map((tok) => tok.value)
        .join('');
      return [kind, type] as const;
    }
    case '[': {
      const kind = 'list';
      const type = blockCheck(1, ['lsquare', 'rsquare'])
        .skipTheBlock()
        .filter((tok) => tok.type !== 'rsquare')
        .map((tok) => tok.value);
      return [kind, type] as const;
    }
    default:
      return ['primary', token.value] as const;
  }
}

function functionParser() {
  let token: Token | undefined = next();
  const fun: IFunction = {
    name: token.value || '',
    returnType: '',
    parameters: {},
    doc: '',
    withCapabilities: [] as string[],
    requiredCapabilities: [] as string[],
    functionCalls: [] as string[],
    body: undefined,
  };
  token = next();
  if (token.type === 'colon') {
    token = next();
    const [kind, value] = praseType(token);
    fun.returnType = kind === 'primary' ? value : { kind, value };
    token = next();
  }
  if (token.type !== 'lparen') {
    throw new Error('function parameters are invalid' + ' ' + fun.name);
  }
  fun.parameters = parseParameters();
  token = next();
  if (token.value === '@doc') {
    token = next();
  }
  if (token.type === 'string') {
    fun.doc = token.value;
    token = next();
  }

  if (token.type !== 'lparen') {
    blockCheck().skipTheBlock();
    return fun;
  }

  const { inTheSameBlock } = blockCheck(2);

  fun.body = [];
  while ((token = nextToken()) && inTheSameBlock(token.type)) {
    fun.body.push(token);
    if (['require-capability', 'with-capability'].includes(token.value)) {
      const blockType = token.value;
      token = next();
      fun.body.push(token);
      if (token.type !== 'lparen') {
        throw new Error(
          'after require-capability or with-capability should have a parentheses',
        );
      }
      token = next();
      fun.body.push(token);
      if (blockType === 'with-capability') {
        if (!fun.withCapabilities.includes(token.value)) {
          fun.withCapabilities.push(token.value as string);
        }
      } else {
        if (!fun.requiredCapabilities.includes(token.value)) {
          fun.requiredCapabilities.push(token.value as string);
        }
      }
      fun.body.push(...blockCheck().skipTheBlock());
    }
  }

  return fun;
}

function addFunctionCalls(
  functionsList: string[],
  modulesList: string[],
  fun: IFunction,
) {
  if (!fun.body) return [];
  const fnCalls: string[] = [];
  let dt = '';
  fun.body.forEach((token) => {
    if (modulesList.includes(token.value) && !dt) {
      dt = token.value;
      return;
    }
    if (dt && token.type === 'dot') {
      dt = `${dt}.`;
      return;
    }
    if (dt && token.type === 'atom' && dt.endsWith('.')) {
      dt += token.value;
      return;
    }
    if (dt) {
      fnCalls.push(dt);
      console.log(`${fun.name} ==> ${dt}`);
      dt = '';
    }
    if (functionsList.includes(token.value) && !fnCalls.includes(token.value)) {
      console.log(`${fun.name} ==> ${token.value}`);
      fnCalls.push(token.value as string);
    }
  });

  return fnCalls;
}

function capabilityParser() {
  let token: Token | undefined = next();
  const cap: ICapability = {
    name: token.value || '',
    returnType: '',
    parameters: {},
    doc: '',
    composedCapabilities: [] as string[],
    managed: false,
    managedParameters: [] as any,
  };
  token = next();
  if (token.type === 'colon') {
    token = next();
    const [kind, value] = praseType(token);
    cap.returnType = kind === 'primary' ? value : { kind, value };
    token = next();
  }
  if (token.type !== 'lparen') {
    throw new Error('capability parameters are invalid' + ' ' + cap.name);
  }
  cap.parameters = parseParameters();
  token = next();
  if (token.value === '@doc') {
    token = next();
  }
  if (token.type === 'string') {
    cap.doc = token.value;
    token = next();
  }

  // TODO: check if the location could be before @doc and if we can have multiple managed properties
  if (token.value === '@managed') {
    token = next();
    cap.managed = true;
    if (token.type === 'atom') {
      const parameter = token.value;
      const manager = next().value;
      cap.managedParameters.push({
        parameter,
        manager,
      });
      token = next();
    }
  }

  if (token.type !== 'lparen') {
    if (cap.name === 'TRANSFER') {
      throw new Error('this should not happen');
    }
    blockCheck().skipTheBlock();
    return cap;
  }

  const { inTheSameBlock } = blockCheck(2);

  while ((token = nextToken()) && inTheSameBlock(token.type)) {
    if (token.value === 'compose-capability') {
      token = next();
      if (token.type !== 'lparen') {
        throw new Error(
          'after require-capability or with-capability should have a parentheses',
        );
      }
      token = next();
      if (!cap.composedCapabilities.includes(token.value)) {
        cap.composedCapabilities.push(token.value as string);
      }
      blockCheck().skipTheBlock();
    }
  }

  return cap;
}

function moduleParser() {
  let token: Token | undefined = next();
  const { inTheSameBlock } = blockCheck();

  const name = token.value;
  token = next();
  const governance =
    token?.type === 'lparan'
      ? blockCheck()
          .skipTheBlock()
          .map((t) => t.value)
          .join('')
      : token?.value;

  const module: IModule = {
    name,
    governance,
    doc: '',
    interfaces: [] as string[],
    usedModules: [] as string[],
    capabilities: [] as any[],
    functions: [] as any[],
  };

  token = next();

  // parse module attributes
  if (token.value === '@doc') {
    token = next();
  }
  if (token.type === 'string') {
    module.doc = token.value as string;
    token = next();
  }

  while ((token = nextToken()) && inTheSameBlock(token.type)) {
    switch (token.type) {
      case 'lparen':
        break;
      case 'use':
        const include = next();
        blockCheck().skipTheBlock();
        module.usedModules.push(include.value);
        break;
      case 'implements':
        const implement = next();
        blockCheck().skipTheBlock();
        module.interfaces.push(implement.value);
        break;
      case 'defun':
        const func = functionParser();
        module.functions.push(func);
        break;
      case 'defcap':
        const capability = capabilityParser();
        module.capabilities.push(capability);
        break;
      default:
        // skip the token if its something else
        console.log('skip module token', token.value);
        blockCheck().skipTheBlock();
        break;
    }
  }
  return module;
}

function fileLevelComponents(lexer: Lexer) {
  const { inTheSameBlock, skipTheBlock } = blockCheck();
  let token: Token | undefined = undefined;
  while ((token = nextToken()) && inTheSameBlock(token.type)) {
    switch (token.type) {
      case 'namespace':
        const namespace = nextToken();
        if (!namespace) throw Error('no namespace');
        skipTheBlock();
        return ['namespace', namespace.value] as const;
      case 'module':
        const module = moduleParser();
        const functionsList = module.functions.map(({ name }) => name);
        module.functions.forEach((fun) => {
          fun.functionCalls = addFunctionCalls(
            functionsList,
            module.usedModules,
            fun,
          );
          delete fun.body;
        });
        return ['module', module] as const;
      default:
        // skip the token if its something else
        console.log('FILE LEVEL SKIP', token.value);
        skipTheBlock();
        return ['unknown', null] as const;
      // break;
    }
  }
  return ['unknown', null] as const;
}

export function parser(contract: string) {
  lexer.reset(contract);
  let token: Token | undefined = undefined;
  const state: IASTree = {
    namespace: [],
    modules: [],
  };
  while ((token = nextToken())) {
    if (token.type !== 'lparen') {
      console.log(token);
      throw Error('invalid token');
    }
    const [type, value] = fileLevelComponents(lexer);
    if (type === 'module') state.modules.push(value);
    if (type === 'namespace') state.namespace.push(value);
  }
  return state;
}
