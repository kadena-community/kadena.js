import type {
  ICommand,
  IPartialPactCommand,
  IUnsignedCommand,
} from '@kadena/client';

export interface IEnvFunctions {
  resultOf(key: string): any;
  load(path: string): Promise<any>;
  deploy(...modules: string[]): string;
  env(key: string): string;
  read(code: string): any;
  spvProof(id: string): string;
}

export const transaction =
  (state: any) =>
  (
    id: string,
    name: string,
    logic: (args: IEnvFunctions) => IPartialPactCommand,
  ) => {};

export const inspect =
  (state: any) =>
  (
    id: string,
    cb: (
      args: IEnvFunctions & { read: (code: string) => Promise<any> },
    ) => void,
  ) => {};

export const kadenaProcess = (config: {
  pactApiUrl: string;
  networkId: string;
  chainId: string;
  gasPayer: { account: string; keys: string[] };
  sign: (tx: IUnsignedCommand) => ICommand;
}) => {
  const state = {};
  return {
    transaction: transaction(state),
    inspect: inspect(state),
  };
};
export const configure = (configs: any) => {};
