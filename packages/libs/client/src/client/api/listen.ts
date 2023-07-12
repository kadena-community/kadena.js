import { ICommandResult, parseResponse } from '@kadena/chainweb-node-client';

import { getUrl, jsonRequest } from '../utils/utils';

import fetch from 'cross-fetch';

export const listen = async (
  host: string,
  requestKey: string,
): Promise<ICommandResult> => {
  const request = jsonRequest({ listen: requestKey });
  const url = getUrl(host, `api/v1/listen`);

  try {
    const response = await fetch(url, request);
    return await parseResponse(response);
  } catch (error) {
    console.error(`An error occurred while calling poll API:`, error);
    throw error;
  }
};
