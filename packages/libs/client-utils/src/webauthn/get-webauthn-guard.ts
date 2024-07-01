import type { ChainId, IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
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

export const getWebauthnGuard = ({
  account,
  chainId,
  networkId,
  host,
}: IGetWalletGuardInput) =>
  pipe(
    () =>
      Pact.modules[
        'n_eef68e581f767dd66c4d4c39ed922be944ede505.webauthn-wallet'
      ]['get-webauthn-guard'](account),
    execution,
    dirtyReadClient<
      PactReturnType<
        IPactModules['n_eef68e581f767dd66c4d4c39ed922be944ede505.webauthn-wallet']['get-webauthn-guard']
      >
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
