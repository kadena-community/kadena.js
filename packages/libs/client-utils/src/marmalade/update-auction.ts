import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { submitClient } from '../core';
import type { IClientConfig } from '../core/utils/helpers';
import type {
  CommonProps,
  IAuctionConfig,
  IConventionalAuctionInput,
  IDutchAuctionInput,
  WithAuction,
} from './config';
import {
  formatAdditionalSigners,
  formatCapabilities,
  formatWebAuthnSigner,
} from './helpers';

interface IUpdateAuctionInput extends CommonProps {
  chainId: ChainId;
  seller: {
    account: string;
    guard: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
}

const updateConventionalAuctionCommand = <C extends IAuctionConfig>({
  chainId,
  seller,
  auctionConfig,
  meta,
  capabilities,
  additionalSigners,
  ...auctionProps
}: WithAuction<C, IUpdateAuctionInput>) => {
  const { saleId, tokenId, startDate, endDate, reservedPrice } =
    auctionProps as unknown as IConventionalAuctionInput;

  return composePactCommand(
    execution(
      Pact.modules['marmalade-sale.conventional-auction']['update-auction'](
        saleId,
        startDate,
        endDate,
        reservedPrice,
      ),
    ),
    addSigner(formatWebAuthnSigner(seller.guard.keys), (signFor) => [
      signFor('coin.GAS'),
      signFor(
        `marmalade-sale.conventional-auction.MANAGE_AUCTION`,
        saleId,
        tokenId,
      ),
      ...formatCapabilities(capabilities, signFor),
    ]),
    ...formatAdditionalSigners(additionalSigners),
    setMeta({ senderAccount: seller.account, chainId, ...meta }),
  );
};

const updateDutchAuctionCommand = <C extends IAuctionConfig>({
  chainId,
  seller,
  auctionConfig,
  ...auctionProps
}: WithAuction<C, IUpdateAuctionInput>) => {
  const {
    saleId,
    tokenId,
    startDate,
    endDate,
    startPrice,
    reservedPrice,
    priceIntervalInSeconds,
  } = auctionProps as unknown as IDutchAuctionInput;

  return composePactCommand(
    execution(
      Pact.modules['marmalade-sale.dutch-auction']['update-auction'](
        saleId,
        startDate,
        endDate,
        startPrice,
        reservedPrice,
        priceIntervalInSeconds,
      ),
    ),
    addSigner(formatWebAuthnSigner(seller.guard.keys), (signFor) => [
      signFor('coin.GAS'),
      signFor(`marmalade-sale.dutch-auction.MANAGE_AUCTION`, saleId, tokenId),
    ]),
    setMeta({ senderAccount: seller.account, chainId }),
  );
};

export const updateAuction = <C extends IAuctionConfig>(
  inputs: WithAuction<C, IUpdateAuctionInput>,
  config: IClientConfig,
) => {
  if (inputs.auctionConfig?.conventional)
    return submitClient<
      PactReturnType<
        IPactModules['marmalade-sale.conventional-auction']['update-auction']
      >
    >(config)(updateConventionalAuctionCommand(inputs));

  if (inputs.auctionConfig?.dutch)
    return submitClient<
      PactReturnType<
        IPactModules['marmalade-sale.dutch-auction']['update-auction']
      >
    >(config)(updateDutchAuctionCommand(inputs));

  throw new Error('Invalid sale type');
};
