import { type ILogger, lexer } from './lexer';

export type IAst = IAstNode[];
export type IAstNode = moo.Token & {
  children?: IAstNode[];
};

const LPAREN: 'lparen' = 'lparen';
const RPAREN: 'rparen' = 'rparen';

export function createAst(contract: string, logger: ILogger = () => {}): IAst {
  lexer.reset(contract);
  return getChildren(lexer, logger);
}

function getChildren(
  lexer: moo.Lexer,
  logger: ILogger,
  parentNodes: IAstNode[] = [],
): IAstNode[] {
  let token: moo.Token | undefined;
  const nodes: IAstNode[] = [];
  while ((token = lexer.next())) {
    switch (token.type) {
      case 'nl':
      case 'ws':
        break;

      case LPAREN:
        const newNode: IAstNode = { ...token };
        nodes.push(newNode);
        newNode.children = getChildren(lexer, logger, nodes);
        break;

      case RPAREN:
        parentNodes.push(token);
        return nodes;

      default:
        nodes.push(token);
        break;
    }
  }

  return nodes;
}

// [ token1, token2 ]
