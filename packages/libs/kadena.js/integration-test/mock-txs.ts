import { ChainwebNetworkId, CommandPayload, Command } from '../src/util/PactCommand';
import { SignCommand } from '../src/util/SignCommand';
import sign from '../src/crypto/sign';
import { KeyPair } from '../src/util';

export function createSampleExecTx(network:ChainwebNetworkId, keyPair:KeyPair, pactCode:string, envData:(object|null) = null):Command {
  const nonce:string = 'step01';

  const cmd:CommandPayload = {
    networkId: network,
    payload: {
      exec: {
        data: envData,
        code: pactCode,
      },
    },
    signers: [{
      'pubKey': keyPair.publicKey,
    }],
    meta: {
      creationTime: Math.round((new Date).getTime() / 1000) - 1,
      ttl: 28800,
      gasLimit: 10000,
      chainId: '0',
      gasPrice: 0.00001,
      sender: 'k:'.concat(keyPair.publicKey),
    },
    nonce: JSON.stringify(nonce),
  };

  const commandStr = JSON.stringify(cmd);
  const cmdWithOneSignature:SignCommand = sign(commandStr, keyPair);
  const signedCommand:Command = {
    cmd: commandStr,
    hash: cmdWithOneSignature.hash,
    sigs: [{ sig: cmdWithOneSignature.sig }],
  };

  return signedCommand;
}