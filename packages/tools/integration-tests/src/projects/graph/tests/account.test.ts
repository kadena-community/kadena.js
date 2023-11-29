import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';
import { grapHost } from '../testdata/constants/network';
import type { ITestData } from '../testdata/devnet/simulation/file';
import { parseLogs } from '../testdata/devnet/simulation/file';
import { getAccountQuery } from '../testdata/queries/getAccount';

let devnetData: ITestData[];

describe('Account', () => {
  beforeAll(() => {
    devnetData = parseLogs();
  });
  test('Query: getAccount', async () => {
    const query = getAccountQuery(devnetData[0].from);
    const response = await request(grapHost).post('').send(query);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('account');
    expect(response.body.data.account.accountName).toEqual(devnetData[0].from);

    expect(response.body.data.account).toHaveProperty('moduleName');
    expect(response.body.data.account).toHaveProperty('__typename');
    expect(response.body.data.account).toHaveProperty('id');
    expect(response.body.data.account).toHaveProperty('transactions');
    expect(response.body.data.account).toHaveProperty('transfers');
    expect(response.body.data.account).toHaveProperty('totalBalance');
    expect(response.body.data.account).toHaveProperty('chainAccounts');
  });
});
