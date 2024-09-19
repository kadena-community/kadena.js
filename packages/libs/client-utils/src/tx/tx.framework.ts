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
  (state: any[]) =>
  (
    id: string,
    description: string,
    cb: (args: IEnvFunctions) => IPartialPactCommand,
  ) => {
    state.push({ id, description, cb, type: 'transaction' });
  };

export const inspect =
  (state: any[]) =>
  (
    id: string,
    cb: (
      args: IEnvFunctions & { read: (code: string) => Promise<any> },
    ) => void,
  ) => {
    state.push({ id, cb, type: 'inspect' });
  };

export const kadenaProcess =
  (config: {
    hostUrl: string;
    defaults: IPartialPactCommand;
    sign: (tx: IUnsignedCommand) => ICommand;
  }) =>
  (
    cb: (functions: {
      transaction: ReturnType<typeof transaction>;
      inspect: ReturnType<typeof inspect>;
    }) => void,
  ) => {
    const state: {
      id: string;
      description?: string;
      cb: () => void;
      result: any;
    }[] = [];

    cb({
      transaction: transaction(state),
      inspect: inspect(state),
    });
    const resultOf = (id: string) =>
      state.find((item) => item.id === id)?.result;
    for (const item of state) {
      if (item.type === 'transaction') {
        // Process transaction
      } else if (item.type === 'inspect') {
        // Process inspect
      }
    }
  };
