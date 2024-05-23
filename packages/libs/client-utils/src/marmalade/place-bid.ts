import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addData,
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import type { ChainId, IPactDecimal } from '@kadena/types';
import { submitClient } from '../core';
import type { IClientConfig } from '../core/utils/helpers';
import {
  formatAdditionalSigners,
  formatCapabilities,
} from '../integration-tests/support/helpers';
import type {
  CommonProps,
  IPlaceBidConfig,
  PlaceBidProps,
  WithPlaceBid,
} from './config';

interface IPlaceBidInput extends CommonProps {
  saleId: string;
  bid: IPactDecimal;
  bidder: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
  escrowAccount: string;
  chainId: ChainId;
}

const placeBidCommand = <C extends IPlaceBidConfig>({
  saleId,
  bid,
  bidder,
  escrowAccount,
  chainId,
  marketplaceConfig,
  meta,
  capabilities,
  additionalSigners,
  ...props
}: WithPlaceBid<C, IPlaceBidInput>) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-sale.conventional-auction']['place-bid'](
        saleId,
        bidder.account,
        readKeyset('account-guard'),
        bid,
      ),
    ),
    addKeyset('account-guard', bidder.keyset.pred, ...bidder.keyset.keys),
    addSigner(bidder.keyset.keys, (signFor) => [
      signFor('coin.GAS'),
      signFor('marmalade-sale.conventional-auction.PLACE_BID', bidder.keyset),
      signFor('coin.TRANSFER', bidder.account, escrowAccount, bid),
      ...formatCapabilities(capabilities, signFor),
    ]),
    marketplaceConfig?.marketplaceFee
      ? addData('marketplace_fee', {
          'mk-account': (props as unknown as PlaceBidProps).marketplaceFee
            .mkAccount,
          'mk-fee-percentage': (props as unknown as PlaceBidProps)
            .marketplaceFee.mkFeePercentage,
        })
      : {},
    ...formatAdditionalSigners(additionalSigners),
    setMeta({ senderAccount: bidder.account, chainId, ...meta }),
  );

export const placeBid = <C extends IPlaceBidConfig>(
  inputs: WithPlaceBid<C, IPlaceBidInput>,
  config: IClientConfig,
) =>
  submitClient<
    PactReturnType<
      IPactModules['marmalade-sale.conventional-auction']['place-bid']
    >
  >(config)(placeBidCommand(inputs));
