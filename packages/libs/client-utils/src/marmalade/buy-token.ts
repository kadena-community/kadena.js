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
import type { ChainId, IPactDecimal } from '@kadena/types';
import { submitClient } from '../core';
import type { IClientConfig } from '../core/utils/helpers';
import type {
  CommonProps,
  IAuctionPurchaseConfig,
  IDutchAuctionPurchaseInput,
  WithAuctionPurchase,
} from './config';
import { formatAdditionalSigners, formatCapabilities, formatWebAuthnSigner } from './helpers';

interface IBuyTokenInput extends CommonProps {
  policyConfig?: { guarded: boolean };
  gasLimit?: number;
  tokenId: string;
  saleId: string;
  amount: IPactDecimal;
  chainId: ChainId;
  seller: {
    account: string;
  };
  buyer: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
  buyerFungibleAccount?: string;
}

const generatePolicyTransactionData = <C extends IAuctionPurchaseConfig>(
  props: Partial<WithAuctionPurchase<C, IBuyTokenInput>>,
): ((cmd: IPartialPactCommand) => IPartialPactCommand)[] => {
  const data = [];

  data.push(addData('buyer', props.buyer!.account));
  data.push(addData('buyer-guard', props.buyer!.keyset));

  if (props.buyerFungibleAccount) {
    data.push(addData('buyer_fungible_account', props.buyerFungibleAccount));
  }

  if (props.auctionConfig?.dutch || props.auctionConfig?.conventional) {
    data.push(
      addData(
        'updated_price',
        Number(
          (props as unknown as IDutchAuctionPurchaseInput).updatedPrice.decimal,
        ),
      ),
    );
  }

  if (props.auctionConfig?.dutch) {
    data.push(addData('buyer_fungible_account', props.buyer!.account));
  }

  if (props.auctionConfig?.conventional) {
    data.push(
      addData(
        'buyer_fungible_account',
        (props as unknown as IDutchAuctionPurchaseInput).escrow.account,
      ),
    );
  }

  return data;
};

const buyTokenCommand = <C extends IAuctionPurchaseConfig>({
  auctionConfig,
  tokenId,
  saleId,
  chainId,
  seller,
  buyer,
  buyerFungibleAccount,
  amount,
  gasLimit = 3000,
  policyConfig,
  meta,
  capabilities,
  additionalSigners,
  ...props
}: WithAuctionPurchase<C, IBuyTokenInput>) =>
  composePactCommand(
    continuation({
      pactId: saleId,
      step: 1,
      rollback: false,
      proof: null,
      data: {},
    }),
    addSigner(formatWebAuthnSigner(buyer.keyset.keys), (signFor) => [
      signFor('coin.GAS'),
      signFor(
        'marmalade-v2.ledger.BUY',
        tokenId,
        seller.account,
        buyer.account,
        amount,
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
      ...(auctionConfig?.dutch
        ? [
            signFor(
              'coin.TRANSFER',
              buyer.account,
              (props as unknown as IDutchAuctionPurchaseInput).escrow.account,
              (props as unknown as IDutchAuctionPurchaseInput).updatedPrice,
            ),
          ]
        : []),
      ...formatCapabilities(capabilities, signFor),
    ]),
    ...generatePolicyTransactionData({
      buyer,
      buyerFungibleAccount,
      auctionConfig,
      ...props,
    }),
    ...formatAdditionalSigners(additionalSigners),
    setMeta({ senderAccount: buyer.account, chainId, gasLimit, ...meta }),
  );

export const buyToken = <C extends IAuctionPurchaseConfig>(
  inputs: WithAuctionPurchase<C, IBuyTokenInput>,
  config: IClientConfig,
) =>
  submitClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['defpact']['sale']>
  >(config)(buyTokenCommand(inputs));
