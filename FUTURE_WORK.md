# Pact lang wrapper

```ts
// Trap
// https://javascript.plainenglish.io/javascript-how-to-intercept-function-and-method-calls-b9fd6507ff02

interface Builder {
	generate(): string;
}

interface RandyModule {
	transferCoin(fromAccount: string, toAccount: string): Builder
}

const MyPactModule: RandyModule = {} as RandyModule;


MyPactModule.transferCoin("k:1", "k:2").generate();
MyPactModule.blaat("k:1", "k:2").generate(); // (blaat k:1 k:2)
const fnCall = MyPactModule.transferCoin // transferCoinBuilder
fnCall.args('fromAccount','k:1')
fnCall.args('toAccount','k:2')
fnCall.generate()
// (transferCoin k:1 k:2)

// pactlang-js generate "randy.module"


class X {
	get() {

	}
}
```
