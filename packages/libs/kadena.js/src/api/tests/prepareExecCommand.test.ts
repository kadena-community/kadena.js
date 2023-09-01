import { type ICommand } from '@kadena/types';

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

  expect(actual).toEqual(command);
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
    hash: '4tZIuaSoVhw0_FQ2HRYv1oO_0JUBZYSX8GhWyS_V7NI',
    sigs: [
      {
        sig: '26d765e3b812d59d80ffbd034d4fc4a1a24f8d0c3929586575617089e5098d967955d348608b515ae9ff7871b46726ffc71252d53b9e562d5bcf3bfe66292906',
      },
    ],
    cmd: '{"networkId":"Mainnet01","payload":{"exec":{"data":null,"code":"(define-keyset \'k (read-keyset \\"accounts-admin-keyset\\"))\\n(module system \'k\\n  (defun get-system-time ()\\n    (time \\"2017-10-31T12:00:00Z\\")))\\n(get-system-time)"}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"0","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
  };

  expect(actual).toEqual(command);
});
