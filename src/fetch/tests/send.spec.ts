import { send, SendRequestBody, SendResponse } from '../send';
import { mockFetch } from './mockFetch';
import pactTestCommand from '../../crypto/tests/mockdata/Pact';
import sign from '../../crypto/sign';
import { SignCommand } from '../../util/SignCommand';
import { Command } from '../../util/PactCommand';
import fetch from 'node-fetch';


jest.mock('node-fetch');
const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFunctionFetch.mockImplementation(mockFetch as jest.MockedFunction<typeof fetch>);


test('/send should return request keys of txs submitted', async () => {
  const commandStr1 = JSON.stringify(pactTestCommand);
  const keyPair1 = {
    publicKey:
      'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    secretKey:
      '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
  };
  const cmdWithOneSignature1:SignCommand = sign(commandStr1, keyPair1);
  const signedCommand1:Command = {
    cmd: commandStr1,
    hash: cmdWithOneSignature1.hash,
    sigs: [{ sig: cmdWithOneSignature1.sig }],
  };
  const expectedRequestKey1 = signedCommand1.hash;

  // A tx created for chain 0 of devnet using `pact -a`.
  const signedCommand2:Command = {
    'hash':'ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q',
    'sigs':[{ 'sig':'0df98906e0c7a6e380f72dac6211b37c321f6555f3eb20ee2736f37784a3edda54da3a15398079b44f474b1fc7f522ffa3ae004a67a0a0266ecc8c82b9a0220b' }],
    'cmd':'{"networkId":"development","payload":{"exec":{"data":null,"code":"(+ 1 2)"}},"signers":[{"pubKey":"f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f"}],"meta":{"creationTime":1655142318,"ttl":28800,"gasLimit":10000,"chainId":"0","gasPrice":1.0e-5,"sender":"k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f"},"nonce":"2022-06-13 17:45:18.211131 UTC"}',
  };
  const expectedRequestKey2 = 'ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q';

  const sendReq:SendRequestBody = {
    cmds: [signedCommand1, signedCommand2],
  };
  const responseExpected:SendResponse = {
    requestKeys: [expectedRequestKey1, expectedRequestKey2],
  };
  const responseActual:SendResponse = await send(sendReq, '');
  expect(responseExpected).toEqual(responseActual);
});

test('/send should return error if sent to wrong chain id', async () => {
  // A tx created for chain 0 of devnet using `pact -a`.
  const signedCommand:Command = {
    'hash':'ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q',
    'sigs':[{ 'sig':'0df98906e0c7a6e380f72dac6211b37c321f6555f3eb20ee2736f37784a3edda54da3a15398079b44f474b1fc7f522ffa3ae004a67a0a0266ecc8c82b9a0220b' }],
    'cmd':'{"networkId":"development","payload":{"exec":{"data":null,"code":"(+ 1 2)"}},"signers":[{"pubKey":"f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f"}],"meta":{"creationTime":1655142318,"ttl":28800,"gasLimit":10000,"chainId":"0","gasPrice":1.0e-5,"sender":"k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f"},"nonce":"2022-06-13 17:45:18.211131 UTC"}',
  };
  const sendReq:SendRequestBody = {
    cmds: [signedCommand],
  };
  const expectedErrorMsg:string = 'Error: Validation failed for hash "ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q": Transaction metadata (chain id, chainweb version) conflicts with this endpoint';
  const responseActual:Promise<SendResponse> = send(sendReq, '/wrongChain/chain/1/pact');
  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('/send should return error for duplicate txs', async () => {
  // A tx created for chain 0 of devnet using `pact -a`.
  const signedCommand:Command = {
    'hash':'ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q',
    'sigs':[{ 'sig':'0df98906e0c7a6e380f72dac6211b37c321f6555f3eb20ee2736f37784a3edda54da3a15398079b44f474b1fc7f522ffa3ae004a67a0a0266ecc8c82b9a0220b' }],
    'cmd':'{"networkId":"development","payload":{"exec":{"data":null,"code":"(+ 1 2)"}},"signers":[{"pubKey":"f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f"}],"meta":{"creationTime":1655142318,"ttl":28800,"gasLimit":10000,"chainId":"0","gasPrice":1.0e-5,"sender":"k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f"},"nonce":"2022-06-13 17:45:18.211131 UTC"}',
  };
  const sendReq:SendRequestBody = {
    cmds: [signedCommand],
  };
  const expectedErrorMsg:string = 'Error: Validation failed for hash "ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q": Transaction already exists on chain';
  const responseActual:Promise<SendResponse> = send(sendReq, '/duplicate/chain/0/pact');
  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});
