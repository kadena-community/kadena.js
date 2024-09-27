import { RequestOptions, SnapResponseType } from '@metamask/snaps-jest';
import { Account } from '../../types';

export const withId = (data: any) => ({
  ...data,
  id: expect.any(String),
});

export const getAccounts = async (
  request: (request: RequestOptions) => Promise<SnapResponseType>,
) => {
  const accountsResponse = await request({
    method: 'kda_getAccounts',
  });
  if ('error' in accountsResponse.response)
    throw new Error(
      'kda_getAccounts resulted in an error: ' +
        JSON.stringify(accountsResponse.response.error),
    );
  return accountsResponse.response.result as Account[];
};
