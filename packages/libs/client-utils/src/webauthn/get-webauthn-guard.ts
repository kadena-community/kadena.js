import type { ChainId } from '@kadena/client';
import { execution } from '@kadena/client/fp';
import type { NetworkId } from '@kadena/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetWalletGuardInput {
  account: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

/**
 * Fetches the WebAuthn guard for a specified account.
 * This function constructs a command to retrieve the WebAuthn guard details from the given wallet account,
 * and returns the first guard from the devices list associated with that account.
 */
export const getWebauthnGuard = ({
  account,
  chainId,
  networkId,
  host,
}: IGetWalletGuardInput) =>
  pipe(
    () =>
      `(at 'guard (at 0 (at 'devices (n_eef68e581f767dd66c4d4c39ed922be944ede505.webauthn-wallet.get-webauthn-guard "${account}"))))`,
    execution,
    dirtyReadClient({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
