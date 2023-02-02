import { PactValue } from '@kadena/types';

import { PactExpression } from '../PactExpression';

declare module '../PactExpression' {
  interface ITestModule {
    simpleFn: () => IPactBuilder;
    transfer: (
      sender: string,
      receiver: string,
      amount: PactValue,
    ) => IPactBuilder;
  }
  interface IPactModules {
    test: ITestModule & IPactBuilder;
  }
}

describe('PactExpression', () => {
  it('can be called to get a builder', () => {
    const pe = PactExpression();
    expect(pe.generate()).toEqual('()');
  });

  it('builds an expression', () => {
    const pe = PactExpression();
    pe.test.generate();
    expect(pe.generate()).toEqual('(test)');
  });

  it('creates an expression', () => {
    const pe = PactExpression().test;
    expect(pe.generate()).toEqual('(test)');
  });

  it('creates an expression', () => {
    const pe = PactExpression().test;
    expect(pe.generate()).toEqual('(test)');
  });

  it('creates an expression from a subelement', () => {
    const pe = PactExpression().test.simpleFn();
    expect(pe.generate()).toEqual('(test.simpleFn)');
  });

  it('creates an expression from a subelement with arguments', () => {
    const pe = PactExpression().test.transfer('sender', 'receiver', {
      decimal: '10.0',
    });
    expect(pe.generate()).toEqual('(test.transfer "sender" "receiver" 10.0)');
  });

  it('creates something that is not defined in the d.ts', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pe = (PactExpression() as any).something.that.is.not.defined('bogus');
    expect(pe.generate()).toEqual('(something.that.is.not.defined "bogus")');
  });
});
