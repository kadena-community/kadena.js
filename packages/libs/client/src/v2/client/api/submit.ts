import {
  getUrl,
  ICommandRequest,
  jsonRequest,
  parseResponse,
} from '../utils/utils';

import fetch from 'cross-fetch';

export const submit = async (
  host: string,
  body: ICommandRequest[],
): Promise<string[]> => {
  const request = jsonRequest({ cmds: body });
  const url = getUrl(host, `api/v1/send`);

  try {
    const response = await fetch(url, request);
    return await parseResponse<{ requestKeys: string[] }>(response).then(
      ({ requestKeys }) => requestKeys,
    );
  } catch (error) {
    console.error(`An error occurred while calling send API:`, error);
    throw error;
  }
};
