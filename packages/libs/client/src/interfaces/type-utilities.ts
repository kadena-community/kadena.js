import { ICapabilityItem } from './IPactCommand';

export type UnionToIntersection<T> = (
  T extends unknown ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export interface IGeneralCapability {
  (name: string, ...args: unknown[]): ICapabilityItem;
  (name: 'coin.GAS'): ICapabilityItem;
}

/**
 * @alpha
 * create withCapability type from a Pact.modules function
 */
export type WithCapability<TCode extends string & { capability: unknown }> =
  ExtractCapabilityType<{ payload: { funs: [TCode] } }>;

export type ExtractCapabilityType<TCommand> = TCommand extends {
  payload: infer TPayload;
}
  ? TPayload extends { funs: infer TFunctions }
    ? TFunctions extends Array<infer TFunction>
      ? UnionToIntersection<TFunction> extends { capability: infer TCapability }
        ? TCapability
        : IGeneralCapability
      : IGeneralCapability
    : IGeneralCapability
  : IGeneralCapability;
