import type {
  IPactModules,
  IPartialPactCommand,
  PactReturnType,
} from '@kadena/client';
import { Pact } from '@kadena/client';
import {
  addData,
  addSigner,
  composePactCommand,
  execution,
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
  ISaleTokenPolicyConfig,
  SalePolicyProps,
  WithSaleTokenPolicy,
} from './config';

interface IOfferTokenInput extends CommonProps {
  tokenId: string;
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
  policyConfig: ISaleTokenPolicyConfig,
  props: SalePolicyProps,
): ((cmd: IPartialPactCommand) => IPartialPactCommand)[] => {
  const data = [];

  if (policyConfig?.guarded) {
    if (props.guards.saleGuard)
      data.push(addData('sale_guard', props.guards.saleGuard));
  }

  if (policyConfig?.hasRoyalty) {
    data.push(
      addData('royalty_spec', {
        creator: props.royalty.creator.account,
        'creator-guard': props.royalty.creator.keyset,
        'royalty-rate': props.royalty.royaltyRate,
        fungible: props.royalty.fungible,
      }),
    );
  }

  if (policyConfig?.auction) {
    data.push(
      addData('quote', {
        fungible: props.auction.fungible,
        'sale-price': props.auction.price,
        'seller-fungible-account': {
          account: props.auction.sellerFungibleAccount.account,
          guard: props.auction.sellerFungibleAccount.keyset,
        },
        'sale-type': props.auction?.saleType ?? '',
      }),
    );
  }

  return data;
};

const offerTokenCommand = <C extends ISaleTokenPolicyConfig>({
  tokenId,
  chainId,
  seller,
  amount,
  timeout,
  policyConfig,
  meta,
  capabilities,
  additionalSigners,
  ...policyProps
}: WithSaleTokenPolicy<C, IOfferTokenInput>) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger'].defpact.sale(
        tokenId,
        seller.account,
        amount,
        timeout,
      ),
    ),
    addSigner(seller.keyset.keys, (signFor) => [
      signFor('coin.GAS'),
      signFor(
        'marmalade-v2.ledger.OFFER',
        tokenId,
        seller.account,
        amount,
        timeout,
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
      policyConfig as ISaleTokenPolicyConfig,
      policyProps as unknown as SalePolicyProps,
    ),
    ...formatAdditionalSigners(additionalSigners),
    setMeta({ senderAccount: seller.account, chainId, ...meta }),
  );

export const offerToken = <C extends ISaleTokenPolicyConfig>(
  inputs: WithSaleTokenPolicy<C, IOfferTokenInput>,
  config: IClientConfig,
) =>
  submitClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['defpact']['sale']>
  >(config)(offerTokenCommand(inputs));
