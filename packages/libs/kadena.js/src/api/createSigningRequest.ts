import type {
  Base16String,
  ChainId,
  EnvData,
  ISigningCap,
  ISigningRequest,
  NetworkId,
} from '@kadena/types';

/**
 * Creates a signing command to be sent to the /sign handler of wallets.
 * @param code The pact code to execute
 * @param data The environment data to be included in the transaction
 * @param caps The signing capabilities to be included in the transaction
 * @param networkId The network id to run the transaction on
 * @param chainId The chain id to run the transaction on
 * @param pubKey The public key of the private key that must be used to sign the transaction
 * @param sender The gas payer of the transaction
 * @param gasLimit The gas limit of the transaction. Keeping this low will help with transaction fees.
 * @param gasPrice The gas price for each unit of gas.
 * @param ttl The amount of time before the transaction expires.
 * @returns
 */
export function createSigningRequest(
  code: string,
  data: EnvData,
  caps: ISigningCap[],
  networkId: NetworkId,
  chainId: ChainId,
  pubKey: Base16String,
  sender: string,
  gasLimit: number,
  gasPrice: number,
  ttl: number,
): ISigningRequest {
  return {
    pactCode: code,
    envData: data,
    sender: sender,
    networkId: networkId,
    chainId: chainId,
    gasLimit: gasLimit,
    gasPrice: gasPrice,
    signingPubKey: pubKey,
    ttl: ttl,
    caps: caps,
  };
}
