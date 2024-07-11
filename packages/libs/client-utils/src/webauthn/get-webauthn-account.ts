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

export const getWebauthnAccount = ({
  account,
  chainId,
  networkId,
  host,
}: IGetWalletGuardInput) =>
  pipe(
    () => 
    `(create-principal (at 'guard (at 0 (at 'devices (n_eef68e581f767dd66c4d4c39ed922be944ede505.webauthn-wallet.get-webauthn-guard "${account}")))))` ,
    execution,
    dirtyReadClient
    ({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
