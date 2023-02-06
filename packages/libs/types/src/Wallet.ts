import type { ChainId, EnvData, ICap, NetworkId, Nonce } from './PactCommand';

/**
 * Pact capability object with role and description to be consumed in Signing API
 * @param role - role of the capability.
 * @param description - description of the capability.
 * @param ICap - name and arguments of the capability
 * @alpha
 */
export interface ISigningCap {
  role: string;
  description: string;
  cap: ICap;
}

/**
 * The signing request is handled by the sign endpoint of wallets.
 * See endpoint here: https://kadena-io.github.io/signing-api/#/definitions/SigningRequest
 */
export interface ISigningRequest {
  pactCode: string;
  envData: EnvData;
  caps: ISigningCap[];
  networkId: NetworkId;
  chainId: ChainId;
  sender: string;
  nonce: Nonce;
  gasLimit: number;
  gasPrice: number;
  signingPubKey: string;
  ttl: number;
}
