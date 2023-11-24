import request from 'supertest';
import { describe, expect, test } from 'vitest';
import { baseUrl } from '../constants/network';
import { getAccountQuery } from '../testdata/queries/getAccount';

describe('Account', () => {
  test('getAccount', async () => {
    const response = await request(baseUrl)
      .post('')
      .send(getAccountQuery)
    console.log(response)
    expect(response.statusCode).toBe(200)
    expect(response.text).toHaveProperty('data')
      });
  });
