import { readFileSync, writeFileSync } from 'fs';
import * as ts from 'typescript';

const createContext = <T extends Record<string, unknown>>() => {
  let context = {} as T;
  return {
    setContext(ctx: Partial<T>) {
      context = { ...context, ...ctx };
    },
    useContext() {
      return context;
    },
  };
};

const { setContext, useContext } = createContext<{
  tables: TableInterface[];
  schemes: SchemeInterface[];
}>();

const indent =
  (space = 1) =>
  (text: string) =>
    text
      .split('\n')
      .map((line) => ' '.repeat(space) + line)
      .join('\n');

const formatError = (node: ts.Node) => {
  return `\n=====Error======\n${
    ts.SyntaxKind[node.kind]
  } is not supported\n _TS_____\n|${indent(1)(
    node.getText(),
  )}\n================\n`;
};

const asPactType = (type: ts.TypeNode) => {
  switch (type.kind) {
    case ts.SyntaxKind.StringKeyword:
      return 'string';
    case ts.SyntaxKind.NumberKeyword:
      return 'decimal';
    case ts.SyntaxKind.TypeReference: {
      return (type as any).typeName.escapedText as string;
    }
  }
  return 'string';
};

const operatorMap = (code: number) => {
  switch (code) {
    case ts.SyntaxKind.ExclamationEqualsEqualsToken:
    case ts.SyntaxKind.ExclamationEqualsToken:
      return '!=';
    case ts.SyntaxKind.EqualsEqualsEqualsToken:
    case ts.SyntaxKind.EqualsEqualsToken:
      return '=';
    case ts.SyntaxKind.LessThanToken:
      return '<';
    case ts.SyntaxKind.GreaterThanToken:
      return '>';
    case ts.SyntaxKind.LessThanEqualsToken:
      return '<=';
    case ts.SyntaxKind.GreaterThanEqualsToken:
      return '>=';
    case ts.SyntaxKind.MinusToken:
      return '-';
    case ts.SyntaxKind.PlusToken:
      return '+';
    default: {
      throw new Error(`Error: TOKEN: ${ts.SyntaxKind[code]} is not supported`);
    }
  }
};

const binaryOperatorMapper = (operator: ts.BinaryOperatorToken) => {
  return operatorMap(operator.kind);
};

const createExpression = (
  statement: ts.Expression | ts.VariableStatement | ts.Block | ts.Statement,
): string | { code: string; openedBlock: number } => {
  switch (statement.kind) {
    case ts.SyntaxKind.FalseKeyword:
      return 'false';
    case ts.SyntaxKind.TrueKeyword:
      return 'true';
    case ts.SyntaxKind.NumericLiteral:
      return (statement as ts.NumericLiteral).text;
    case ts.SyntaxKind.Identifier:
      return (statement as ts.Identifier).escapedText.toString();
    case ts.SyntaxKind.StringLiteral:
      return `"${(statement as ts.StringLiteral).text}"`;
    case ts.SyntaxKind.PrefixUnaryExpression: {
      const pue = statement as ts.PrefixUnaryExpression;
      return `${operatorMap(pue.operator)}${createExpression(pue.operand)}`;
    }
    case ts.SyntaxKind.CallExpression: {
      const callExpression = statement as ts.CallExpression;
      let functionName = getFunctionName(callExpression);
      const parts = functionName.split('.');
      let args = callExpression.arguments.map(createExpression);
      const { tables } = useContext();
      if (tables) {
        const table = tables.find(
          ({ propertyName }) => propertyName === parts[0],
        );
        if (table) {
          args = [`"${table.tableName}"`, ...args];
          functionName = parts[1];
        }
      }
      return `(${functionName} ${args.join(' ')})`;
    }
    case ts.SyntaxKind.PropertyAccessExpression: {
      const propertyAccessExpression = statement as ts.PropertyAccessExpression;
      const name = propertyAccessExpression.name.escapedText;
      if (
        propertyAccessExpression.expression.kind === ts.SyntaxKind.ThisKeyword
      ) {
        return name.toString();
      }
      return `(at "${name}" ${createExpression(
        propertyAccessExpression.expression,
      )} )`;
    }

    case ts.SyntaxKind.BinaryExpression: {
      const binaryExpression = statement as ts.BinaryExpression;
      const { left, right, operatorToken } = binaryExpression;
      return `(${binaryOperatorMapper(operatorToken)} ${createExpression(
        left,
      )} ${createExpression(right)})`;
    }

    case ts.SyntaxKind.FirstStatement:
    case ts.SyntaxKind.VariableStatement: {
      const variableStatement = statement as ts.VariableStatement;
      return (
        variableStatement.declarationList.declarations.map((dec) => {
          if (!dec.initializer) {
            throw new Error('variable should have initializer');
          }
          if (dec.name.kind === ts.SyntaxKind.Identifier) {
            return {
              code: `(let ((${dec.name.escapedText} ${createExpression(
                dec.initializer,
              )}))`,
              openedBlock: 1,
            };
          }
          if (dec.name.kind === ts.SyntaxKind.ObjectBindingPattern) {
            const elements = dec.name.elements;
            const vars = elements.map((elm) => {
              if (elm.name.kind !== ts.SyntaxKind.Identifier) {
                return { name: formatError(elm.name) };
              }
              return {
                name: elm.name.escapedText,
                propertyName: elm.propertyName
                  ? (elm.propertyName as ts.Identifier).escapedText
                  : undefined,
                defaultValue: elm.initializer
                  ? createExpression(elm.initializer)
                  : undefined,
              };
            });

            if (vars.length === 1 && vars[0].defaultValue === undefined) {
              const [variable] = vars;
              return {
                code: `(let ((${variable.name} (at "${
                  variable.propertyName ?? variable.name
                }" ${createExpression(dec.initializer)})))`,
                openedBlock: 1,
              };
            }
            if (vars.length > 1) {
              const tempVariable = 'temp_variable';
              const varChain = vars.reduce(
                (acc, variable) =>
                  `(let ((${variable.name} (at "${
                    variable.propertyName ?? variable.name
                  }" ${tempVariable})))${acc ? `\n${indent(2)(acc)}` : ''}`,
                '',
              );
              return {
                code: `(let (( ${tempVariable} ${createExpression(
                  dec.initializer,
                )}))\n${indent(2)(varChain)}`,
                openedBlock: vars.length + 1,
              };
            }
          }
        })[0] ?? ''
      );
    }

    case ts.SyntaxKind.ArrayLiteralExpression: {
      const arrayStatement = statement as ts.ArrayLiteralExpression;
      return `[${arrayStatement.elements.map(createExpression).join(' ')}]`;
    }

    case ts.SyntaxKind.ConditionalExpression: {
      const conditional = statement as ts.ConditionalExpression;
      const { condition, whenTrue, whenFalse } = conditional;
      return `(if ${createExpression(condition)} ${createExpression(
        whenTrue,
      )} ${createExpression(whenFalse)})`;
    }

    case ts.SyntaxKind.ObjectLiteralExpression: {
      const objectLiteralExpression = statement as ts.ObjectLiteralExpression;
      const props = objectLiteralExpression.properties.map((prop) => ({
        name: (prop.name! as ts.Identifier).escapedText,
        value: createExpression((prop as ts.PropertyAssignment).initializer),
      }));
      return `{ ${props
        .map(({ name, value }) => `${name}: ${value}`)
        .join(',')} }`;
    }

    case ts.SyntaxKind.ArrowFunction: {
      const arrowFunction = statement as ts.ArrowFunction;
      return createExpression(arrowFunction.body as ts.Block);
    }

    case ts.SyntaxKind.Block: {
      const statements = createBlock(statement as ts.Block);
      return `\n${indent(2)(statements.join('\n'))}\n`;
    }

    default:
      return formatError(statement);
  }
};

const getFunctionName = (callExpression: ts.CallExpression) => {
  if (callExpression.expression.kind === ts.SyntaxKind.Identifier) {
    return (callExpression.expression as ts.Identifier).escapedText.toString();
  }
  let next: ts.PropertyAccessExpression =
    callExpression.expression as ts.PropertyAccessExpression;
  let name = '';
  while (next.kind === ts.SyntaxKind.PropertyAccessExpression) {
    name = `${next.name.escapedText}${name ? `.${name}` : ''}`;
    next = next.expression as ts.PropertyAccessExpression;
  }
  return name;
};

const createBlock = (block: ts.Block) => {
  let blockOpened = 0;
  const statements: string[] =
    block.statements
      .map((statement) => {
        let expression: ts.Expression | ts.Statement | undefined = statement;
        if (statement.kind === ts.SyntaxKind.ExpressionStatement) {
          expression = (statement as ts.ExpressionStatement).expression;
        }
        if (statement.kind === ts.SyntaxKind.ReturnStatement) {
          expression = (statement as ts.ReturnStatement).expression;
        }
        if (expression) {
          const res = createExpression(expression);
          if (typeof res === 'string') {
            return indent(blockOpened * 2)(res);
          }
          const { code, openedBlock } = res;
          const old = blockOpened;
          blockOpened += openedBlock;
          try {
            return indent(old * 2)(code);
          } catch (e) {
            return e.message;
          }
        }

        return formatError(statement);
      })
      .filter(Boolean) ?? [];

  return [...statements, ...(blockOpened ? [')'.repeat(blockOpened)] : [])];
};

const extractDecorator = (decorator: ts.ModifierLike) => {
  if (decorator.kind === ts.SyntaxKind.Decorator) {
    switch (decorator.expression.kind) {
      case ts.SyntaxKind.CallExpression: {
        const callExpression = decorator.expression as ts.CallExpression;
        if (callExpression.expression.kind !== ts.SyntaxKind.Identifier) {
          throw new Error('Only one call for decorators is supported');
        }
        return {
          isCall: true as const,
          name: (callExpression.expression as ts.Identifier).getText(),
          arguments: callExpression.arguments.map((arg) => {
            if (arg.kind !== ts.SyntaxKind.StringLiteral) {
              throw new Error(
                'only string literal is acceptable for decorators arguments',
              );
            }
            return (arg as ts.StringLiteral).text;
          }),
        };
      }
      case ts.SyntaxKind.Identifier: {
        return {
          isCall: false as const,
          name: decorator.expression.getText(),
        };
      }
    }
  }
};

const extractMethod = (method: ts.MethodDeclaration) => {
  const parameters = method.parameters.map((parameter) => ({
    name: (parameter.name as ts.Identifier).escapedText,
    type: parameter.type ? asPactType(parameter.type) : 'unknown',
  }));

  const statements = method.body ? createBlock(method.body) : [];
  const decorators = method.modifiers?.map(extractDecorator) ?? [];
  if (decorators.length > 1) {
    throw new Error('only one decorator is valid');
  }

  return {
    decorator: decorators[0],
    method: (method.name as ts.Identifier).escapedText,
    parameters,
    statements,
  };
};

const extractProperty = (item: ts.PropertyDeclaration) => {
  const decorators = item.modifiers?.map(extractDecorator) ?? [];
  if (decorators.length > 1) {
    throw new Error('only one de decorator is valid fpr properties');
  }
  switch (item.initializer?.kind) {
    case ts.SyntaxKind.NewExpression: {
      const initializer = item.initializer as ts.NewExpression;
      const name = initializer.expression.getText();
      const typeArgs =
        initializer.typeArguments?.map((t) => {
          if (ts.isTypeReferenceNode(t)) {
            const schemeType = (
              t.typeName as ts.Identifier
            ).escapedText.toString();
            return schemeType;
          }
        }) ?? [];

      const args =
        (initializer.arguments
          ?.map(createExpression)
          .filter((a) => typeof a === 'string') as string[]) ?? [];

      return {
        decorator: decorators[0],
        name: item.name.getText(),
        initializer: {
          class: name,
          typeArguments: typeArgs,
        },
        args,
      };
    }
    default:
      throw new Error(
        item.initializer
          ? formatError(item.initializer)
          : 'Initializer of a property cant be undefined',
      );
  }
};

const extractScheme =
  (definedInterfaces: DefinedInterface[]) =>
  (member: ts.ClassElement): SchemeInterface | undefined => {
    if (member.kind !== ts.SyntaxKind.PropertyDeclaration) {
      return;
    }
    const { decorator, name, initializer } = extractProperty(
      member as ts.PropertyDeclaration,
    );
    if (
      (decorator && decorator.name === 'defschema') ||
      (!decorator && initializer.class === 'Scheme')
    ) {
      if (initializer.typeArguments.length !== 1) {
        throw new Error('type argument is required for defining a scheme');
      }
      const intf = definedInterfaces.find(
        (v) => v.name === initializer.typeArguments[0],
      );
      if (!intf) {
        throw new Error('Interface can not be found');
      }
      return {
        schemeName: decorator?.arguments?.length
          ? decorator.arguments[0]
          : name,
        propertyName: name,
        type: intf,
      };
    }
  };

const extractTables = (member: ts.ClassElement): TableInterface | undefined => {
  if (member.kind !== ts.SyntaxKind.PropertyDeclaration) {
    return;
  }
  const { decorator, name, initializer, args } = extractProperty(
    member as ts.PropertyDeclaration,
  );
  if (
    (decorator && decorator.name === 'deftable') ||
    (!decorator && initializer.class === 'Table')
  ) {
    if (args.length !== 1) {
      throw new Error('scheme is required for defining a table');
    }
    return {
      tableName: decorator?.arguments?.length ? decorator.arguments[0] : name,
      propertyName: name,
    };
  }
};

const classMember = (member: ts.ClassElement) => {
  switch (member.kind) {
    case ts.SyntaxKind.MethodDeclaration: {
      const { decorator, method, parameters, statements } = extractMethod(
        member as ts.MethodDeclaration,
      );
      const params = parameters
        .map(({ name, type }) => `${name}${type ? `:${type}` : ''}`)
        .join(' ');
      let fun = '';
      if (decorator?.name === 'defcap' || decorator?.name === 'governance') {
        fun = `defcap`;
      }
      if (decorator?.name === 'defpact') {
        fun = `defpact`;
      }
      if (!decorator?.name) {
        fun = `defun`;
      }
      if (fun !== '') {
        return `(${fun} ${
          decorator?.isCall && decorator.arguments.length > 0
            ? decorator.arguments[0]
            : method
        } (${params})${
          statements?.length ? `\n${indent(2)(statements.join('\n'))}\n` : ''
        })`;
      }
    }
    case ts.SyntaxKind.PropertyDeclaration: {
      const property = member as ts.PropertyDeclaration;
      const { decorator, name, initializer } = extractProperty(property);
      if (
        (decorator && decorator.name === 'defschema') ||
        initializer.class === 'Scheme'
      ) {
        const { schemes } = useContext();
        const scheme = schemes.find(
          ({ propertyName }) => propertyName === name,
        );
        if (!scheme) {
          throw new Error(`Scheme is not available for property ${name}`);
        }
        return `(defschema ${scheme?.schemeName}\n${scheme.type.properties
          .map((p) => `  ${p.prop}: ${p.type}`)
          .join('\n')}\n)`;
      }

      if (
        (decorator && decorator.name === 'deftable') ||
        initializer.class === 'Table'
      ) {
        const { decorator, name, initializer, args } =
          extractProperty(property);
        const schemeProperty = args[0];
        if (!schemeProperty) {
          throw new Error('Scheme should be passed to the Table');
        }
        const { schemes } = useContext();
        const scheme = schemes.find(
          ({ propertyName }) => propertyName === schemeProperty,
        );
        if (!scheme) {
          throw new Error(
            `Scheme is not available for property ${schemeProperty}`,
          );
        }
        return `(deftable ${
          (decorator?.arguments && decorator.arguments[0]) ?? name
        }:{${scheme.schemeName}} )`;
      }
    }

    default:
      return formatError(member);
  }
};

function convertClass(
  classObject: ts.ClassDeclaration,
  definedInterfaces: DefinedInterface[],
) {
  const namespace = classObject.modifiers
    ?.map((mod) => {
      if (mod.kind === ts.SyntaxKind.Decorator) {
        if ((mod.expression as any).expression.escapedText === 'namespace') {
          return (mod.expression as any).arguments[0].text;
        }
      }
    })
    .filter(Boolean);

  const moduleNameDecorator = classObject.modifiers
    ?.map((mod) => {
      if (mod.kind === ts.SyntaxKind.Decorator) {
        if ((mod.expression as any).expression.escapedText === 'module') {
          return (mod.expression as any).arguments[0].text;
        }
      }
    })
    .filter(Boolean);

  const usedInterfaces =
    classObject.heritageClauses?.flatMap((item) => {
      if (item.token === ts.SyntaxKind.ImplementsKeyword) {
        return item.types.map(
          (itf) => (itf.expression as ts.Identifier).escapedText,
        );
      }
    }) ?? [];
  const governance = classObject.members
    .map((member) => {
      if (member.kind === ts.SyntaxKind.MethodDeclaration) {
        const { decorator, method } = extractMethod(
          member as ts.MethodDeclaration,
        );
        if (decorator?.name === 'governance')
          return decorator?.isCall && decorator.arguments.length > 0
            ? decorator.arguments[0]
            : method;
      }
    })
    .filter(Boolean)[0];

  const schemes = classObject.members
    .map(extractScheme(definedInterfaces))
    .filter(Boolean) as SchemeInterface[];

  setContext({ schemes });

  const tables = classObject.members
    .map(extractTables)
    .filter(Boolean) as Array<{
    tableName: string;
    propertyName: string;
  }>;

  setContext({ tables });

  const moduleName = moduleNameDecorator?.length
    ? moduleNameDecorator[0]
    : classObject.name?.escapedText ?? 'no-name';
  return `; AUTO-GENERATED FILE
${namespace?.map((name) => `(namespace "${name}")`)}
(module ${moduleName} ${governance ?? ''}
${usedInterfaces
  .map((itf) => `(implements ${itf})`)
  .map(indent(2))
  .join('\n')}
  \n
${classObject.members
  .map(classMember)
  .filter(Boolean)
  .map(indent(2))
  .join('\n\n')}
)
  `;
}

interface DefinedInterface {
  name: string;
  properties: {
    prop: string;
    type: string | undefined;
  }[];
}

interface SchemeInterface {
  type: DefinedInterface;
  schemeName: string;
  propertyName: string;
}

interface TableInterface {
  tableName: string;
  propertyName: string;
}

function toInterface(intf: ts.InterfaceDeclaration): DefinedInterface {
  const name = intf.name.escapedText;
  return {
    name: `${name}`,
    properties: intf.members.map((elm) => {
      if (elm.kind !== ts.SyntaxKind.PropertySignature) {
        return { prop: formatError(elm), type: undefined };
      }
      const property = elm as ts.PropertySignature;
      return { prop: property.name.getText(), type: property.type?.getText() };
    }),
  };
}

export function convertFile(sourceFile: ts.SourceFile) {
  if (sourceFile.kind !== ts.SyntaxKind.SourceFile) {
    throw 'not a valid ts file';
  }

  const interfaces = sourceFile.statements
    .map((node) => {
      if (node.kind == ts.SyntaxKind.InterfaceDeclaration) {
        return toInterface(node as ts.InterfaceDeclaration);
      }
    })
    .filter(Boolean) as DefinedInterface[];

  return sourceFile.statements.map((node) => {
    if (node.kind == ts.SyntaxKind.ClassDeclaration) {
      return convertClass(node as ts.ClassDeclaration, interfaces);
    }
  });
}

const fileName = process.argv[2];
const output = process.argv[3];

// Parse a file
const sourceFile = ts.createSourceFile(
  fileName,
  readFileSync(fileName).toString(),
  ts.ScriptTarget.ES2015,
  /*setParentNodes */ true,
);

const pact = convertFile(sourceFile).join('\n\n\n');

if (output) {
  writeFileSync(output, pact);
}
console.log(pact);
