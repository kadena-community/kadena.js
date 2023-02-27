/* eslint-env es6 */
const { rules } = require('@rushstack/eslint-plugin');
const AST_NODE_TYPES = require('@typescript-eslint/experimental-utils');

const origTypedefVar = rules['typedef-var'];

const typedefVar = {
  ...origTypedefVar,
  // We are overriding the behavior to allow for implicit typing of exported
  //   variables that are created by calling a function
  //  e.g. This is allowed: `export const StyledButton = styled('button', {})`
  create: (context) => {
    // This rule implements the variableDeclarationIgnoreFunction=true behavior from
    function isVariableDeclarationIgnoreFunction(node) {
      return (
        node.type === AST_NODE_TYPES.FunctionExpression ||
        node.type === AST_NODE_TYPES.ArrowFunctionExpression
      );
    }

    function getNodeName(node) {
      return node.type === AST_NODE_TYPES.Identifier ? node.name : undefined;
    }

    return {
      VariableDeclarator(node) {
        if (node.id.typeAnnotation) {
          // An explicit type declaration was provided
          return;
        }

        if (node.init?.type === 'CallExpression') {
          // The variable is declared by a function call
          return;
        }

        // These are @typescript-eslint/typedef exemptions
        if (
          node.id.type ===
            AST_NODE_TYPES.ArrayPattern /* ArrayDestructuring */ ||
          node.id.type ===
            AST_NODE_TYPES.ObjectPattern /* ObjectDestructuring */ ||
          (node.init && isVariableDeclarationIgnoreFunction(node.init))
        ) {
          return;
        }

        // Ignore this case:
        //
        //   for (const NODE of thing) { }
        let current = node.parent;
        while (current) {
          switch (current.type) {
            case AST_NODE_TYPES.VariableDeclaration:
              // Keep looking upwards
              current = current.parent;
              break;
            case AST_NODE_TYPES.ForOfStatement:
            case AST_NODE_TYPES.ForInStatement:
              // Stop traversing and don't report an error
              return;
            default:
              // Stop traversing
              current = undefined;
              break;
          }
        }

        // Is it a local variable?
        current = node.parent;
        while (current) {
          switch (current.type) {
            // function f() {
            //   const NODE = 123;
            // }
            case AST_NODE_TYPES.FunctionDeclaration:

            // class C {
            //   public m(): void {
            //     const NODE = 123;
            //   }
            // }
            case AST_NODE_TYPES.MethodDefinition:

            // let f = function() {
            //   const NODE = 123;
            // }
            case AST_NODE_TYPES.FunctionExpression:

            // let f = () => {
            //   const NODE = 123;
            // }
            case AST_NODE_TYPES.ArrowFunctionExpression:
              // Stop traversing and don't report an error
              return;
          }

          current = current.parent;
        }

        const nodeName = getNodeName(node.id);
        if (nodeName) {
          context.report({
            node,
            messageId: 'expected-typedef-named',
            data: { name: nodeName },
          });
        } else {
          context.report({
            node,
            messageId: 'expected-typedef',
          });
        }
      },
    };
  },
};

module.exports = typedefVar;
