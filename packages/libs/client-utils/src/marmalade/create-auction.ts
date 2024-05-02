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
import {
  formatAdditionalSigners,
  formatCapabilities,
} from '../integration-tests/support/helpers';
import {
  CommonProps,
  IAuctionConfig,
  IConventionalAuctionInput,
  IDutchAuctionInput,
  WithAuction,
} from './config';

interface ICreateAuctionInput extends CommonProps {
  chainId: ChainId;
  seller: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
}

const createConventionalAuctionCommand = <C extends IAuctionConfig>({
  chainId,
  seller,
  auctionConfig,
  meta,
  capabilities,
  additionalSigners,
  ...auctionProps
}: WithAuction<C, ICreateAuctionInput>) => {
  const { saleId, tokenId, startDate, endDate, reservedPrice } =
    auctionProps as unknown as IConventionalAuctionInput;

  return composePactCommand(
    execution(
      Pact.modules['marmalade-sale.conventional-auction']['create-auction'](
        saleId,
        tokenId,
        startDate,
        endDate,
        reservedPrice,
      ),
    ),
    addSigner(seller.keyset.keys, (signFor) => [
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

const createDutchAuctionCommand = <C extends IAuctionConfig>({
  chainId,
  seller,
  auctionConfig,
  ...auctionProps
}: WithAuction<C, ICreateAuctionInput>) => {
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
      Pact.modules['marmalade-sale.dutch-auction']['create-auction'](
        saleId,
        tokenId,
        startDate,
        endDate,
        reservedPrice,
        startPrice,
        priceIntervalInSeconds,
      ),
    ),
    addSigner(seller.keyset.keys, (signFor) => [
      signFor('coin.GAS'),
      signFor(`marmalade-sale.dutch-auction.MANAGE_AUCTION`, saleId, tokenId),
    ]),
    setMeta({ senderAccount: seller.account, chainId }),
  );
};

export const createAuction = <C extends IAuctionConfig>(
  inputs: WithAuction<C, ICreateAuctionInput>,
  config: IClientConfig,
) => {
  if (inputs.auctionConfig?.conventional)
    return submitClient<
      PactReturnType<
        IPactModules['marmalade-sale.conventional-auction']['create-auction']
      >
    >(config)(createConventionalAuctionCommand(inputs));

  if (inputs.auctionConfig?.dutch)
    return submitClient<
      PactReturnType<
        IPactModules['marmalade-sale.dutch-auction']['create-auction']
      >
    >(config)(createDutchAuctionCommand(inputs));

  throw new Error('Invalid sale type');
};
