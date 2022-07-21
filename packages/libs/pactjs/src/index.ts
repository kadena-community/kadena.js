import { Pact } from './pact';
import { FunctionResponse } from './pact-typing';

const builder: FunctionResponse = Pact.coin.TRANSFER('k:20394', 1203);

// executing 'call' does a fetch
builder
  .call()
  .then(async (res) => {
    console.log('res', await res.text());
    console.log('success');
  })
  .catch((error) => {
    console.error(error);
  });

// executing 'generate' creates the expression
const exp: string = builder.generate();
console.log({ exp });

// ======== executing something that's not defined in the types
const hello: boolean = true;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const expression = (Pact as any).anything.you.like.to
  .call('something arg', hello)
  .generate();

console.log({ expression });
