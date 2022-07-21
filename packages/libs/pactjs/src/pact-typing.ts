import type { Response } from 'node-fetch';

export type PactExpression = string;

export interface FunctionResponse {
  generate: () => PactExpression;
  call: () => Promise<Response>;
}

// To be generated
export interface Pact {
  coin: {
    // (coin.TRANSFER "k:013948193857" 10)
    TRANSFER: (accountKey: string, amount: number) => FunctionResponse;
  };
}
