import { IPartialPactCommand, ISigningRequest } from '@kadena/client';
import yaml from 'js-yaml';

export type RequestScheme =
  | 'invalid'
  | 'quickSignRequest'
  | 'signingRequest'
  | 'PactCommand'
  | 'base64'
  | 'Array';

export function determineSchema(
  input: string,
  triedBase64: boolean = false,
): RequestScheme {
  try {
    // TODO: pase YAML as well
    const json: any = yaml.load(input);
    if (!json || typeof json !== 'object') {
      throw new Error('Invalid JSON');
    }
    if ('cmd' in json) {
      JSON.parse(json.cmd);
      return 'quickSignRequest';
    }
    if ('code' in json) {
      return 'signingRequest';
    }
    if ('payload' in json) {
      return 'PactCommand';
    }
  } catch (e) {
    try {
      if (triedBase64) {
        return 'invalid';
      }
      console.log('try base64');
      if (
        determineSchema(Buffer.from(input, 'base64').toString(), true) !==
        'invalid'
      ) {
        return 'base64';
      }
    } catch (e) {
      return 'invalid';
    }
  }
  return 'invalid';
}

export const signingRequestToPactCommand = (
  signingRequest: ISigningRequest,
): IPartialPactCommand => {
  return {
    payload: {
      exec: {
        code: signingRequest.code,
        data: signingRequest.data ?? {},
      },
    },
    meta: {
      chainId: signingRequest.chainId,
      gasLimit: signingRequest.gasLimit,
      gasPrice: signingRequest.gasPrice,
      ttl: signingRequest.ttl,
      sender: signingRequest.sender,
    },
    nonce: signingRequest.nonce,
  };
};
