import type { Response } from 'node-fetch';

export type PactExpression = string;

export interface IFunctionResponse {
  generate: () => PactExpression;
  call: () => Promise<Response>;
}

// To be generated
export interface IPact {
  coin: {
    // (coin.TRANSFER "k:013948193857" 10)
    TRANSFER: (accountKey: string, amount: number) => IFunctionResponse;
  };
}
