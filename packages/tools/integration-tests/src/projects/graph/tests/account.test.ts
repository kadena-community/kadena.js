import request from 'supertest';
import { describe, expect, test } from 'vitest';
import { grapHost } from '../testdata/constants/network';
import { getAccountQuery } from '../testdata/queries/getAccount';
import { createAccounts } from '../testdata/setup/create-account';

describe('Account', () => {
  test('getAccount', async () => {
    
   const response = await request(grapHost)
      .post('')
      .send(getAccountQuery)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('account')
    expect(response.body.data.account).toHaveProperty('accountName')
    expect(response.body.data.account).toHaveProperty('moduleName')
    expect(response.body.data.account).toHaveProperty('__typename')
    expect(response.body.data.account).toHaveProperty('id')
    expect(response.body.data.account).toHaveProperty('transactions')
    expect(response.body.data.account).toHaveProperty('transfers')
    expect(response.body.data.account).toHaveProperty('totalBalance')
    expect(response.body.data.account).toHaveProperty('chainAccounts')
      });
  });

