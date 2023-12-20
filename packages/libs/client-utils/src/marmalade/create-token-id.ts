import type { ChainId } from '@kadena/client';
import { Pact } from '@kadena/client';
import { dirtyReadClient } from '../core';
import { IClientConfig } from '../core/utils/helpers';

interface ICreateTokenIdInput {
  uri: string;
  policies: string[];
  account: { account: string; publicKeys: string[] };
  creationGuard: { keys: string[]; pred: 'keys-all' | 'keys-2' | 'keys-any' };
  gasPayer: { account: string; publicKeys: string[] };
  chainId: ChainId;
}

/**
 * @alpha
 */
function createTokenIdCommand({
  account,
  creationGuard,
  gasPayer = account,
  chainId,
  uri,
  policies = [
    'marmalade-v2.non-fungible-policy-v1',
    'marmalade-v2.guard-policy-v1',
  ],
}: ICreateTokenIdInput) {
  const transaction = Pact.builder
    .execution(
      `(marmalade-v2.ledger.create-token-id {"precision": 0, "policies": (read-msg "policies"), "uri": (read-string "uri")} (read-keyset "creation_guard"))`,
    )
    .addData('uri', uri)
    .addData('policies', policies)
    .addData('creation_guard', creationGuard)
    .addSigner(gasPayer.publicKeys, (signFor) => [signFor('coin.GAS')])
    .setMeta({ chainId, senderAccount: gasPayer.account })
    .getCommand();
  return transaction;
}

// turbo run build --filter @kadena/kadena-cli^...

/**
 * @alpha
 */
export const createTokenId = (
  inputs: ICreateTokenIdInput,
  config: Omit<IClientConfig, 'sign'>,
) => dirtyReadClient(config)(createTokenIdCommand(inputs));
