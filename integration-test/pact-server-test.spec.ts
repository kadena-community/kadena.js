// Expects pact server to be running at http://127.0.0.1:9001.
// To run: `$ npm run start:pact`.
// Requires `pact` to be installed: https://github.com/kadena-io/pact

import { ChainwebNetworkId, CommandPayload, Command } from '../src/util/PactCommand';
import { send, SendRequestBody } from '../src/fetch/send';
import { SignCommand } from '../src/util/SignCommand';
import sign from '../src/crypto/sign';

const network:ChainwebNetworkId = 'development';
const apiHost:string = 'http://127.0.0.1:9001';
const kp = {
  publicKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  secretKey: '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
};
const nonce:string = 'step01';
const pactCode:string = "(define-keyset 'k (read-keyset \"accounts-admin-keyset\"))\n(module system \'k\n  (defun get-system-time ()\n    (time \"2017-10-31T12:00:00Z\")))\n(get-system-time)";
const envData:object = {
  'accounts-admin-keyset': ['ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d'],
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
    'pubKey': 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  }],
  meta: { creationTime: 0, ttl: 0, gasLimit: 0, chainId: '0', gasPrice: 0, sender: '' },
  nonce: JSON.stringify(nonce),
};

test('[Pact Server] Makes a send request and retrieve request key', async () => {
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
