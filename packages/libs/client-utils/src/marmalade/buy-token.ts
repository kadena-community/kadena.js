import type {
  IPactModules,
  IPartialPactCommand,
  ISigner,
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
  Guard,
  IAuctionPurchaseConfig,
  IDutchAuctionPurchaseInput,
  WithAuctionPurchase,
} from './config';
import {
  formatAdditionalSigners,
  formatCapabilities,
  formatWebAuthnSigner,
} from './helpers';

interface IBuyTokenInput extends CommonProps {
  policyConfig?: { guarded: boolean };
  gasLimit?: number;
  tokenId: string;
  saleId: string;
  amount: IPactDecimal;
  chainId: ChainId;
  signerPublicKey: string;
  seller: {
    account: string;
  };
  buyer: {
    account: string;
    guard: Guard;
  };
  sellerFungibleAccount?: string;
  buyerFungibleAccount?: string;
}

const generatePolicyTransactionData = <C extends IAuctionPurchaseConfig>(
  props: Partial<WithAuctionPurchase<C, IBuyTokenInput>>,
): ((cmd: IPartialPactCommand) => IPartialPactCommand)[] => {
  const data = [];

  data.push(addData('buyer', props.buyer!.account));
  data.push(addData('buyer-guard', props.buyer!.guard));

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
  sellerFungibleAccount,
  amount,
  gasLimit = 3000,
  policyConfig,
  meta,
  capabilities,
  signerPublicKey,
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
    addSigner(formatWebAuthnSigner(signerPublicKey as ISigner), (signFor) => [
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
      ...(auctionConfig?.dutch || auctionConfig?.conventional
        ? [
            signFor(
              'coin.TRANSFER',
              buyerFungibleAccount,
              (props as unknown as IDutchAuctionPurchaseInput).escrow.account,
              (props as unknown as IDutchAuctionPurchaseInput).updatedPrice,
            ),
            signFor(
              'coin.TRANSFER',
              (props as unknown as IDutchAuctionPurchaseInput).escrow.account,
              sellerFungibleAccount,
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
