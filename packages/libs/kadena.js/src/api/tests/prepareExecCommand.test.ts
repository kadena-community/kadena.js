import { ICommand } from '@kadena/types';

import { prepareExecCommand } from '../prepareExecCommand';

import {
  command,
  envData,
  keyPairs,
  meta,
  nonce,
  pactCode,
} from './mockdata/execCommand';

test('Creates a signed Pact PactIExecCommand with undefined `networkId`', () => {
  const actual = prepareExecCommand(
    keyPairs,
    nonce,
    pactCode,
    meta,
    undefined, // networkId
    envData,
  );
  const expected = command;

  expect(expected).toEqual(actual);
});

test('Creates a signed Pact PactIExecCommand with networkId=Mainnet01 and undefined `envData`', () => {
  const actual = prepareExecCommand(
    keyPairs,
    nonce,
    pactCode,
    meta,
    'Mainnet01',
    undefined, // envData
  );

  const command: ICommand = {
    hash: '4CHbBVXGGf1OJQG4A7lDxsJLFe9PLzbYa4jLsJwUAAc',
    sigs: [
      {
        sig: 'b67aa495a8d06d099925b1b8b34f6824b523f39472372af42d8a429404360f723e2b0fb602468be10b23a9c2b1bbe4514ca066479a5d10914e0e8cd91b1a0504',
      },
    ],
    cmd: '{"networkId":"Mainnet01","payload":{"exec":{"data":null,"code":"(define-keyset \'k (read-keyset \\"accounts-admin-keyset\\"))\\n(module system \'k\\n  (defun get-system-time ()\\n    (time \\"2017-10-31T12:00:00Z\\")))\\n(get-system-time)"}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
  };

  expect(command).toEqual(actual);
});
