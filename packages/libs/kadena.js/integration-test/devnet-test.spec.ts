// Expects devnet server to be running at http://localhost:8080.
// To run, follow instructions at https://github.com/kadena-io/devnet.

import { ChainwebNetworkId, CommandPayload, Command } from '../src/util/PactCommand';
import { send, SendRequestBody } from '../src/fetch/send';
import { SignCommand } from '../src/util/SignCommand';
import sign from '../src/crypto/sign';

const network:ChainwebNetworkId = 'development';
const apiHost:string = 'http://localhost:8080/chainweb/0.0/development/chain/0/pact';
const kp = {
  publicKey: 'f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
  secretKey: 'da81490c7efd5a95398a3846fa57fd17339bdf1b941d102f2d3217ad29785ff0',
};
const nonce:string = 'step01';
const pactCode:string = "(define-keyset 'k (read-keyset \"accounts-admin-keyset\"))\n(module system \'k\n  (defun get-system-time ()\n    (time \"2017-10-31T12:00:00Z\")))\n(get-system-time)";
const envData:object = {
  'accounts-admin-keyset': ['f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f'],
};

const cmd:CommandPayload = {
  networkId: network,
  payload: {
    exec: {
      data: envData,
      code: pactCode,
    },
  },
  signers: [{
    'pubKey': 'f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
  }],
  meta: {
    creationTime: Math.round((new Date).getTime() / 1000) - 1,
    ttl: 28800,
    gasLimit: 10000,
    chainId: '0',
    gasPrice: 0.00001,
    sender: 'k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
  },
  nonce: JSON.stringify(nonce),
};

test('[DevNet] Makes a send request and retrieve request key', async () => {
  const commandStr = JSON.stringify(cmd);
  const cmdWithOneSignature:SignCommand = sign(commandStr, kp);
  const signedCommand:Command = {
    cmd: commandStr,
    hash: cmdWithOneSignature.hash,
    sigs: [{ sig: cmdWithOneSignature.sig }],
  };
  const sendReq:SendRequestBody = {
    cmds: [signedCommand],
  };

  var actual = await send(sendReq, apiHost);
  var expected = {
    requestKeys: [signedCommand.hash],
  };
  expect(actual).toEqual(expected);
});
