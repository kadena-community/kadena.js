import type {
  IPactModules,
  IPartialPactCommand,
  PactReturnType,
} from '@kadena/client';
import {
  addData,
  addSigner,
  composePactCommand,
  continuation,
  setMeta,
} from '@kadena/client/fp';
import type { ChainId, IPactDecimal, IPactInt } from '@kadena/types';
import { submitClient } from '../core';
import type { IClientConfig } from '../core/utils/helpers';
import {
  formatAdditionalSigners,
  formatCapabilities,
} from '../integration-tests/support/helpers';
import type {
  CommonProps,
  IWithdrawSaleTokenPolicyConfig,
  WithWithdrawSaleTokenPolicy,
  WithdrawSalePolicyProps,
} from './config';

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

const generatePolicyTransactionData = (
  policyConfig: IWithdrawSaleTokenPolicyConfig,
  props: WithdrawSalePolicyProps,
): ((cmd: IPartialPactCommand) => IPartialPactCommand)[] => {
  const data = [];

  if (policyConfig?.guarded) {
    if (props.guards.saleGuard)
      data.push(addData('sale_guard', props.guards.saleGuard));
  }

  return data;
};

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
  ...policyProps
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
    addSigner(seller.keyset.keys, (signFor) => [
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
    ...generatePolicyTransactionData(
      policyConfig as IWithdrawSaleTokenPolicyConfig,
      policyProps as unknown as WithdrawSalePolicyProps,
    ),
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
