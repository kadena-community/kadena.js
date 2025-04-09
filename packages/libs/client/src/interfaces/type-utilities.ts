import type { ICap } from '@kadena/types';
import type { IPactModules } from '../pact';

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

/**
 * Prettify transforms a type for clearer presentation or debugging.
 *
 * @internal
 */
export type Prettify<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Makes specified properties required in T.
 *
 * @internal
 */
export type WithRequired<T, K extends keyof T> = Prettify<
  T & { [P in K]-?: T[P] }
>;

/**
 * Recursively makes all properties optional.
 *
 * @internal
 */
export type AllPartial<T> = {
  [P in keyof T]?: T[P] extends {} ? AllPartial<T[P]> : T[P];
} & {};
type FnRest = '' | ` ${string}`;

type GetFuncReturnType<M, F> = M extends keyof IPactModules
  ? F extends keyof IPactModules[M]
    ? IPactModules[M][F] extends (...args: any[]) => infer R
      ? R
      : never
    : never
  : never;

type RootModule<T> = T extends `(${infer moduleType}.${infer func}${FnRest})`
  ? func extends `${string} ` | `${string} ${string}`
    ? never
    : GetFuncReturnType<moduleType, func>
  : never;

type ModuleWithNamespace<T> =
  T extends `(${infer namespaceType}.${infer moduleType}.${infer func}${FnRest})`
    ? func extends `${string} ` | `${string} ${string}`
      ? never
      : GetFuncReturnType<`${namespaceType}.${moduleType}`, func>
    : never;

/**
 * @internal
 */
export type ExtractPactModule<T> =
  | RootModule<T>
  | ModuleWithNamespace<T> extends never
  ? string
  : RootModule<T> | ModuleWithNamespace<T>;
