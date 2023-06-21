import { ICommandResult, IPreflightResult } from '@kadena/chainweb-node-client';

import { ICommandRequest, request } from './request';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type

export interface ILocalOptions {
  preflight?: boolean;
  signatureValidation?: boolean;
}

export type LocalResponse<Opt extends ILocalOptions> = Opt extends {
  preflight: true;
}
  ? IPreflightResult
  : ICommandResult;

export const local: <T extends ILocalOptions>(
  host: string,
  body: ICommandRequest,
  options: T,
) => Promise<LocalResponse<T>> = request('local');
