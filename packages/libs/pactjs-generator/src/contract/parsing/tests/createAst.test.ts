import { type IAst, type IAstNode, createAst } from '../createAst';

describe('createAst', () => {
  it('returns an ast with only root elements', () => {
    const contract = `;; comment 1\n;; comment 2`;
    const ast = createAst(contract, console.log);
    expect(ast).toHaveLength(2);
  });

  it('provides an ast with 3 children', () => {
    const contract = `(module coin GOVERNANCE
      (defun transfer (sender:string receiver:string))
    )`;
    const ast = createAst(contract, console.log);
    expect(ast).toHaveLength(2);
    expect(ast[0].children).toHaveLength(5);
    expect(ast[0].children![3].children).toHaveLength(4);
    expect(ast[0].children![3].children![2].children).toHaveLength(6);

    const expectedAst = [
      {
        value: '(',
        children: [
          { value: 'module' },
          { value: 'coin' },
          { value: 'GOVERNANCE' },
          {
            value: '(',
            children: [
              { value: 'defun' },
              { value: 'transfer' },
              {
                value: '(',
                children: [
                  { value: 'sender' },
                  { value: ':' },
                  { value: 'string' },
                  { value: 'receiver' },
                  { value: ':' },
                  { value: 'string' },
                ],
              },
              { value: ')' },
            ],
          },
          { value: ')' },
        ],
      },
      { value: ')' },
    ];
    expect(simplifyTree(ast)).toEqual(expectedAst);
  });

  it('provides an ast with children, the first being the namespace', () => {
    const contract = `(namespace 'free)
    (module coin GOVERNANCE
      (defun transfer (sender:string receiver:string))
    )`;
    const ast = createAst(contract, console.log);
    expect(ast).toHaveLength(4);
    expect(ast[0].children![0].text).toEqual('namespace');
    expect(ast[0].children![1].text).toContain('free');
  });

  it('provides an ast with children, the first being the namespace using double quotes', () => {
    const contract = `(namespace "free")
    (module coin GOVERNANCE
      (defun transfer (sender:string receiver:string))
    )`;
    const ast = createAst(contract, console.log);
    expect(ast).toHaveLength(4);
    expect(ast[0].children![0].text).toEqual('namespace');
    expect(ast[0].children![1].text).toContain('free');
  });
});

type SimpleAst = ISimpleAstNode[];

interface ISimpleAstNode {
  value: string;
  children?: ISimpleAstNode[];
}

function simplifyTree(ast: IAst): SimpleAst {
  return ast.map(function simplify({
    value,
    children,
  }: IAstNode): ISimpleAstNode {
    if (children) {
      return { value, children: children.map(simplify) };
    }
    return { value };
  });
}
