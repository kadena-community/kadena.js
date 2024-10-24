import { useAccount } from '@/hooks/account';
import { Sale } from '@/hooks/getSales';
import { useRemoveSale } from '@/hooks/removeSale';
import { useTransaction } from '@/hooks/transaction';
import { env } from '@/utils/env';
import { createSignWithSpireKeySDK } from '@/utils/signWithSpireKey';
import { ICommand, IUnsignedCommand } from '@kadena/client';
import type { Guard } from '@kadena/client-utils/marmalade';
import { buyToken, getEscrowAccount } from '@kadena/client-utils/marmalade';
import { Button } from '@kadena/kode-ui';
import { PactNumber } from '@kadena/pactjs';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
export interface RegularSaleProps {
  tokenImageUrl: string;
  sale: Sale;
}

export const RegularSale = ({ sale }: RegularSaleProps) => {
  const { setTransaction } = useTransaction();

  const router = useRouter() as AppRouterInstance;
  const searchParams = useSearchParams();
  const { account } = useAccount();
  const { deleteSale } = useRemoveSale(sale.saleId);

  useEffect(() => {
    const transaction = searchParams.get('transaction');
    if (transaction) {
      router.push(`/transaction?transaction=${transaction}`);
    }
  }, []);

  const onTransactionSigned = (transaction: IUnsignedCommand | ICommand) => {
    setTransaction(transaction);
    router.push(`/transaction?returnUrl=/tokens`);
  };
  const config = {
    host: env.URL,
    networkId: env.NETWORKID,
    chainId: sale.chainId,
    sign: createSignWithSpireKeySDK([account], onTransactionSigned),
  };

  console.log(env);
  const handleBuyNow = async () => {
    if (!account) {
      alert('Please connect your wallet first to buy.');
      return;
    }

    const escrowAccount = (await getEscrowAccount({
      saleId: sale.saleId,
      host: env.URL,
      networkId: env.NETWORKID,
      chainId: sale.chainId,
    })) as { account: string };

    try {
      await buyToken(
        {
          tokenId: sale.tokenId,
          saleId: sale.saleId,
          amount: new PactNumber(sale.amount).toPactDecimal(),
          chainId: sale.chainId,
          seller: {
            account: sale.seller.account,
          },
          signerPublicKey: account?.devices[0].guard.keys[0],
          buyer: {
            account: account.accountName,
            guard: account.guard as Guard,
          },
          buyerFungibleAccount: account.accountName,
          capabilities: [
            {
              name: 'marmalade-v2.ledger.BUY',
              props: [
                sale.tokenId,
                sale.seller.account,
                account.accountName,
                sale.amount,
                sale.saleId,
              ],
            },
            {
              name: `coin.TRANSFER`,
              props: [
                account.accountName,
                escrowAccount.account,
                sale.startPrice,
              ],
            },
          ],
        },
        {
          ...config,
          defaults: {
            networkId: config.networkId,
            meta: { chainId: sale.chainId },
          },
        },
      ).execute();
      deleteSale();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button variant="primary" onClick={handleBuyNow}>
      Buy Now
    </Button>
  );
};
