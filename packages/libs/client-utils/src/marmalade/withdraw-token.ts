import type { IPactModules, PactReturnType } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  continuation,
  setMeta,
} from '@kadena/client/fp';
import type { ChainId, IPactDecimal, IPactInt } from '@kadena/types';
import { submitClient } from '../core';
import type { IClientConfig } from '../core/utils/helpers';
import type {
  CommonProps,
  IWithdrawSaleTokenPolicyConfig,
  WithWithdrawSaleTokenPolicy,
} from './config';
import {
  formatAdditionalSigners,
  formatCapabilities,
  formatWebAuthnSigner,
} from './helpers';

interface IWithdrawTokenInput extends CommonProps {
  tokenId: string;
  saleId: string;
  amount: IPactDecimal;
  timeout: IPactInt;
  chainId: ChainId;
  seller: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
}

const withdrawTokenCommand = <C extends IWithdrawSaleTokenPolicyConfig>({
  tokenId,
  saleId,
  chainId,
  seller,
  amount,
  timeout,
  policyConfig,
  meta,
  capabilities,
  additionalSigners,
}: WithWithdrawSaleTokenPolicy<C, IWithdrawTokenInput>) =>
  composePactCommand(
    continuation({
      pactId: saleId,
      step: 0,
      rollback: true,
      proof: null,
      data: {
        id: tokenId,
        seller: seller.account,
        amount,
        timeout,
      },
    }),
    addSigner(formatWebAuthnSigner(seller.keyset.keys), (signFor) => [
      signFor('coin.GAS'),
      signFor(
        'marmalade-v2.ledger.WITHDRAW',
        tokenId,
        seller.account,
        amount,
        timeout,
        saleId,
      ),
      ...(policyConfig?.guarded
        ? [
            signFor(
              'marmalade-v2.guard-policy-v1.SALE',
              tokenId,
              seller.account,
              amount,
            ),
          ]
        : []),
      ...formatCapabilities(capabilities, signFor),
    ]),
    ...formatAdditionalSigners(additionalSigners),
    setMeta({ senderAccount: seller.account, chainId, ...meta }),
  );

export const withdrawToken = <C extends IWithdrawSaleTokenPolicyConfig>(
  inputs: WithWithdrawSaleTokenPolicy<C, IWithdrawTokenInput>,
  config: IClientConfig,
) =>
  submitClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['defpact']['sale']>
  >(config)(withdrawTokenCommand(inputs));
