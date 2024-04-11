import { readFileSync, writeFileSync } from 'fs';
import * as ts from 'typescript';

const indent =
  (space = 1) =>
  (text: string) =>
    text
      .split('\n')
      .map((line) => ' '.repeat(space) + line)
      .join('\n');

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

const binaryOperatorMapper = (operator: ts.BinaryOperatorToken) => {
  switch (operator.kind) {
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
      throw new Error(
        `Error: TOKEN: ${ts.SyntaxKind[operator.kind]} is not supported`,
      );
    }
  }
};

const createExpression = (
  statement: ts.Expression | ts.VariableStatement,
): string => {
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
    case ts.SyntaxKind.PrefixUnaryExpression:
      return;
    case ts.SyntaxKind.CallExpression: {
      const callExpression = statement as ts.CallExpression;
      const functionName = getFunctionName(callExpression);
      const args = callExpression.arguments.map(createExpression);
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
      return variableStatement.declarationList.declarations
        .map((dec) => {
          if (!dec.initializer) {
            throw new Error('variable should have initializer');
          }
          return `(let ((${
            (dec.name as ts.Identifier).escapedText
          } ${createExpression(dec.initializer)}))`;
        })
        .join('\n');
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

    case ts.SyntaxKind.ArrowFunction: {
      const arrowFunction = statement as ts.ArrowFunction;
    }

    default:
      return formatError(statement);
  }
};

const getFunctionName = (callExpression: ts.CallExpression) => {
  if (callExpression.expression.kind === ts.SyntaxKind.Identifier) {
    return (callExpression.expression as ts.Identifier).escapedText;
  }
  let next: ts.PropertyAccessExpression =
    callExpression.expression as ts.PropertyAccessExpression;
  let name = '';
  while (next.kind === ts.SyntaxKind.PropertyAccessExpression) {
    name = `${name ? `${name}.` : ''}${next.name.escapedText}`;
    next = next.expression as ts.PropertyAccessExpression;
  }
  return name;
};

const extractMethod = (method: ts.MethodDeclaration) => {
  const decorator = (
    method.modifiers?.length ? method.modifiers[0] : undefined
  ) as ts.Decorator | undefined;
  const decoratorName = decorator
    ? (decorator.expression as ts.Identifier).escapedText
    : undefined;

  const parameters = method.parameters.map((parameter) => ({
    name: (parameter.name as ts.Identifier).escapedText,
    type: parameter.type ? asPactType(parameter.type) : 'unknown',
  }));

  let blockOpened = 0;
  const statements: string[] =
    method.body?.statements
      .map((statement) => {
        if (statement.kind === ts.SyntaxKind.ExpressionStatement) {
          const expression = (statement as ts.ExpressionStatement).expression;
          try {
            return indent(blockOpened * 2)(createExpression(expression));
          } catch (e) {
            return e.message;
          }
        }
        if (statement.kind === ts.SyntaxKind.VariableStatement) {
          blockOpened += 1;
          const variableStatement = statement as ts.VariableStatement;
          try {
            return indent((blockOpened - 1) * 2)(
              createExpression(variableStatement),
            );
          } catch (e) {
            return e.message;
          }
        }
        if (statement.kind === ts.SyntaxKind.ReturnStatement) {
          const expression = (statement as ts.ReturnStatement).expression;
          if (expression) {
            try {
              return indent(blockOpened * 2)(createExpression(expression));
            } catch (e) {
              return e.message;
            }
          }
          return;
        }
        return formatError(statement);
      })
      .filter(Boolean) ?? [];

  return {
    decorator: decoratorName,
    method: (method.name as ts.Identifier).escapedText,
    parameters,
    statements: blockOpened
      ? [...statements, ')'.repeat(blockOpened)]
      : statements,
  };
};

const formatError = (node: ts.Node) => {
  return `\n=====Error=====\n ${
    ts.SyntaxKind[node.kind]
  } is not supported\n${node.getText()}\n================\n`;
};

function classMember(member: ts.ClassElement) {
  switch (member.kind) {
    case ts.SyntaxKind.MethodDeclaration: {
      const { decorator, method, parameters, statements } = extractMethod(
        member as ts.MethodDeclaration,
      );
      const params = parameters
        .map(({ name, type }) => `${name}${type ? `:${type}` : ''}`)
        .join(' ');
      let fun = '';
      if (decorator === 'defcap' || decorator === 'governance') {
        fun = `defcap`;
      }
      if (decorator === 'defpact') {
        fun = `defpact`;
      }
      if (!decorator) {
        fun = `defun`;
      }
      if (fun !== '') {
        return `(${fun} ${method} (${params})${
          statements?.length ? `\n${indent(2)(statements.join('\n'))}\n` : ''
        })`;
      }
    }

    default:
      return formatError(member);
  }
}

function convertClass(classObject: ts.ClassDeclaration) {
  const namespace = classObject.modifiers
    ?.map((mod) => {
      if (mod.kind === ts.SyntaxKind.Decorator) {
        if ((mod.expression as any).expression.escapedText === 'namespace') {
          return (mod.expression as any).arguments[0].text;
        }
      }
    })
    .filter(Boolean);

  const interfaces =
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
        if (decorator === 'governance') return method;
      }
    })
    .filter(Boolean)[0];
  return `; AUTO-GENERATED FILE
${namespace?.map((name) => `(namespace "${name}")`)}
(module ${classObject.name?.escapedText || 'not-named'} ${governance ?? ''}
${interfaces
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

export function convertFile(sourceFile: ts.SourceFile) {
  if (sourceFile.kind !== ts.SyntaxKind.SourceFile) {
    throw 'not a valid ts file';
  }

  return sourceFile.statements.map((node) => {
    if (node.kind == ts.SyntaxKind.ClassDeclaration) {
      return convertClass(node as ts.ClassDeclaration);
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
