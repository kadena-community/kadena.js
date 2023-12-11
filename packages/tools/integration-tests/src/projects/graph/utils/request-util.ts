import request from 'supertest';
import { grapHost } from '../testdata/constants/network';

export async function sendQuery(query: string | object | undefined) {
 const queryResponse = await request(grapHost).post('').send(query);

 if (queryResponse.body.errors !== undefined) {
  console.error("Unexpected Error Found:")
  console.error(queryResponse.body.errors)
  throw new Error(`An unexpected has been logged to stderr.`);
 } else {
  return queryResponse
 }
}
