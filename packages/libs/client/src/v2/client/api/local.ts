import {
  ICommandResult,
  IPreflightResult,
  parseResponse,
} from '@kadena/chainweb-node-client';

import { getUrl, ICommandRequest, jsonRequest } from '../utils/utils';

import fetch from 'cross-fetch';

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

export const local = async <T extends ILocalOptions>(
  host: string,
  body: ICommandRequest,
  options?: T,
): Promise<LocalResponse<T>> => {
  const request = jsonRequest(body);
  const url = getUrl(host, `api/v1/local`, options);

  try {
    const response = await fetch(url, request);
    return await parseResponse(response);
  } catch (error) {
    console.error(`An error occurred while calling local API:`, error);
    throw error;
  }
};
