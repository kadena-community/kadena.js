import { IPartialPactCommand, ISigningRequest } from '@kadena/client';
import yaml from 'js-yaml';

export type RequestScheme =
  | 'invalid'
  | 'quickSignRequest'
  | 'signingRequest'
  | 'PactCommand';

export function determineSchema(input: string): RequestScheme {
  try {
    // TODO: pase YAML as well
    const json: any = yaml.load(input);
    if (!json || typeof json !== 'object') {
      return 'invalid';
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
    return 'invalid';
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
