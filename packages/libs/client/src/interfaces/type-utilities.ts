import { type ICap } from '@kadena/types';

/**
 * @internal
 */
export type UnionToIntersection<T> = (
  T extends unknown ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

/**
 * @internal
 */
export interface IGeneralCapability {
  (name: string, ...args: unknown[]): ICap;
  (name: 'coin.GAS'): ICap;
}

/**
 * create withCapability type from a Pact.modules function
 *
 * @public
 */
export type WithCapability<TCode extends string & { capability: unknown }> =
  ExtractCapabilityType<{ payload: { funs: [TCode] } }>;

/**
 * @internal
 */
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
