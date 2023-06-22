import { getUrl, ICommandRequest, jsonRequest, parseResponse } from './request';

export const submit = async (
  host: string,
  body: ICommandRequest[],
): Promise<string[]> => {
  const request = jsonRequest({ cmds: body });
  const url = getUrl(host, `api/v1/send`);

  try {
    const response = await fetch(url, request);
    return await parseResponse(response);
  } catch (error) {
    console.error(`An error occurred while calling send API:`, error);
    throw error;
  }
};
